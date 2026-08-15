"use client";

declare global {
  interface Window {
    fbq?: (command: "track" | "trackCustom", eventName: string) => void;
    __metaPixelInitialized?: boolean;
    __metaPixelLastPageViewPath?: string;
  }
}

function logMetaPixelEvent(eventName: string) {
  if (process.env.NODE_ENV === "development") {
    console.log(`[Meta Pixel] ${eventName}`);
  }
}

export function trackMetaPageView() {
  logMetaPixelEvent("PageView");
  if (typeof window === "undefined" || typeof window.fbq !== "function") return;

  window.fbq("track", "PageView");
}

export function trackMetaCustomEvent(eventName: string) {
  logMetaPixelEvent(eventName);
  if (typeof window === "undefined" || typeof window.fbq !== "function") return;

  window.fbq("trackCustom", eventName);
}

export function trackMetaLead() {
  logMetaPixelEvent("Lead");
  if (typeof window === "undefined" || typeof window.fbq !== "function") return;

  window.fbq("track", "Lead");
}
