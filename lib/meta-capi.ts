import "server-only";

import { defaultMetaGraphApiVersion, metaPixelId as defaultMetaPixelId, productionSiteUrl } from "@/lib/meta-config";

type MetaUserData = {
  client_ip_address?: string;
  client_user_agent?: string;
  fbp?: string;
  fbc?: string;
};

type MetaCapiResponse = {
  events_received?: number;
  messages?: string[];
  error?: {
    message?: string;
    type?: string;
    code?: number;
    error_subcode?: number;
    fbtrace_id?: string;
  };
};

function getCookieValue(cookieHeader: string | null, cookieName: string) {
  if (!cookieHeader) return undefined;

  return cookieHeader
    .split(";")
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith(`${cookieName}=`))
    ?.slice(cookieName.length + 1);
}

function getClientIpAddress(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwardedFor || request.headers.get("cf-connecting-ip") || request.headers.get("x-real-ip") || undefined;
}

function getMetaUserData(request: Request): MetaUserData {
  const cookieHeader = request.headers.get("cookie");

  return {
    client_ip_address: getClientIpAddress(request),
    client_user_agent: request.headers.get("user-agent") || undefined,
    fbp: getCookieValue(cookieHeader, "_fbp"),
    fbc: getCookieValue(cookieHeader, "_fbc"),
  };
}

function getMetaEndpoint() {
  const pixelId = process.env.META_PIXEL_ID || defaultMetaPixelId;
  const graphApiVersion = process.env.META_GRAPH_API_VERSION || defaultMetaGraphApiVersion;

  return `https://graph.facebook.com/${graphApiVersion}/${pixelId}/events`;
}

export async function sendMetaLeadEvent(request: Request, eventId: string) {
  const accessToken = process.env.META_CAPI_ACCESS_TOKEN;
  if (!accessToken) {
    console.warn("Meta CAPI Lead skipped: META_CAPI_ACCESS_TOKEN is not configured.");
    return;
  }

  const payload: {
    data: Array<{
      event_name: "Lead";
      event_time: number;
      event_id: string;
      action_source: "website";
      event_source_url: string;
      user_data: MetaUserData;
    }>;
    test_event_code?: string;
  } = {
    data: [
      {
        event_name: "Lead",
        event_time: Math.floor(Date.now() / 1000),
        event_id: eventId,
        action_source: "website",
        event_source_url: `${productionSiteUrl}/payment`,
        user_data: getMetaUserData(request),
      },
    ],
  };

  if (process.env.META_TEST_EVENT_CODE) {
    payload.test_event_code = process.env.META_TEST_EVENT_CODE;
  }

  try {
    const response = await fetch(`${getMetaEndpoint()}?access_token=${encodeURIComponent(accessToken)}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(2500),
    });
    const result = (await response.json().catch(() => null)) as MetaCapiResponse | null;

    if (!response.ok) {
      console.warn("Meta CAPI Lead delivery failed.", {
        status: response.status,
        code: result?.error?.code,
        type: result?.error?.type,
        fbtrace_id: result?.error?.fbtrace_id,
      });
      return;
    }

    if (result?.events_received !== undefined && result.events_received < 1) {
      console.warn("Meta CAPI Lead delivery reported no received events.", {
        events_received: result.events_received,
      });
    }
  } catch (error) {
    console.warn("Meta CAPI Lead delivery failed.", {
      error: error instanceof Error ? error.name : "UnknownError",
    });
  }
}
