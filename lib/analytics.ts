"use client";

type AnalyticsParams = Record<string, string | number | boolean | null | undefined>;

declare global {
  interface Window {
    gtag?: (command: "event", name: string, params?: AnalyticsParams) => void;
  }
}

export function trackEvent(name: string, params?: AnalyticsParams) {
  if (process.env.NODE_ENV === "development") {
    console.log(`[GA Event] ${name}`, params ?? {});
  }

  if (typeof window === "undefined" || typeof window.gtag !== "function") return;

  window.gtag("event", name, params);
}
