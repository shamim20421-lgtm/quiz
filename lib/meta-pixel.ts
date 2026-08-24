"use client";

import { metaPixelId } from "@/lib/meta-config";

const metaPixelScriptId = "meta-pixel-script";
const metaPixelScriptSrc = "https://connect.facebook.net/en_US/fbevents.js";
const emptyMetaEventParams = {};

type Fbq = {
  (command: "init", pixelId: string): void;
  (command: "set", key: "autoConfig", value: boolean, pixelId: string): void;
  (command: "track" | "trackCustom", eventName: string): void;
  (command: "track", eventName: "Lead", params: Record<string, never>, options: { eventID: string }): void;
  callMethod?: (...args: unknown[]) => void;
  loaded?: boolean;
  push?: Fbq;
  queue: unknown[][];
  version?: string;
};

declare global {
  interface Window {
    fbq?: Fbq;
    _fbq?: Fbq;
    __metaPixelInitialized?: boolean;
    __metaPixelLastPageViewPath?: string;
  }
}

function logMetaPixelEvent(eventName: string) {
  if (process.env.NODE_ENV === "development") {
    console.log(`[Meta Pixel] ${eventName}`);
  }
}

function ensureMetaPixelInitialized() {
  if (typeof window === "undefined") return false;

  if (typeof window.fbq !== "function") {
    const pixelQueue = ((...args: unknown[]) => {
      if (pixelQueue.callMethod) {
        pixelQueue.callMethod(...args);
        return;
      }

      pixelQueue.queue.push(args);
    }) as Fbq;

    window.fbq = pixelQueue;
    window._fbq = pixelQueue;
    pixelQueue.push = pixelQueue;
    pixelQueue.loaded = true;
    pixelQueue.version = "2.0";
    pixelQueue.queue = [];
  } else if (!window._fbq) {
    window._fbq = window.fbq;
  }

  if (!document.getElementById(metaPixelScriptId) && !document.querySelector(`script[src="${metaPixelScriptSrc}"]`)) {
    const script = document.createElement("script");
    script.id = metaPixelScriptId;
    script.async = true;
    script.src = metaPixelScriptSrc;
    const firstScript = document.getElementsByTagName("script")[0];
    firstScript.parentNode?.insertBefore(script, firstScript);
  }

  if (!window.__metaPixelInitialized) {
    window.__metaPixelInitialized = true;
    window.fbq("set", "autoConfig", false, metaPixelId);
    window.fbq("init", metaPixelId);
  }

  return true;
}

export function trackMetaPageView(pathname: string) {
  if (typeof window === "undefined") return;
  if (window.__metaPixelLastPageViewPath === pathname) return;
  if (!ensureMetaPixelInitialized() || typeof window.fbq !== "function") return;

  window.__metaPixelLastPageViewPath = pathname;
  logMetaPixelEvent("PageView");
  window.fbq("track", "PageView");
}

export function trackMetaCustomEvent(eventName: string) {
  if (!ensureMetaPixelInitialized() || typeof window.fbq !== "function") return;

  logMetaPixelEvent(eventName);
  window.fbq("trackCustom", eventName);
}

export function trackMetaLead(eventId: string) {
  if (!eventId) return;
  if (!ensureMetaPixelInitialized() || typeof window.fbq !== "function") return;

  logMetaPixelEvent("Lead");
  window.fbq("track", "Lead", emptyMetaEventParams, { eventID: eventId });
}
