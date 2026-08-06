"use client";

import { AlertCircle, X } from "lucide-react";

export function ErrorDialog({
  title,
  message,
  onClose,
  onRetry,
}: {
  title: string;
  message: string;
  onClose: () => void;
  onRetry: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-[#071426]/80 px-4 backdrop-blur-sm" role="presentation">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="start-error-title"
        aria-describedby="start-error-message"
        className="w-full max-w-[420px] rounded-3xl bg-white p-5 text-slate-900 shadow-sm"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-50 text-rose-600">
              <AlertCircle aria-hidden="true" className="h-5 w-5" />
            </span>
            <h2 id="start-error-title" className="text-xl font-black">
              {title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="বন্ধ করুন"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 text-slate-700 focus:outline focus:outline-2 focus:outline-rose-500"
          >
            <X aria-hidden="true" className="h-5 w-5" />
          </button>
        </div>
        <p id="start-error-message" className="mt-4 leading-7 text-slate-600">
          {message}
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={onClose}
            className="min-h-12 rounded-full border border-slate-300 px-5 font-bold text-slate-800 focus:outline focus:outline-2 focus:outline-rose-500"
          >
            ফিরে যান
          </button>
          <button
            type="button"
            onClick={onRetry}
            className="min-h-12 rounded-full bg-rose-500 px-5 font-bold text-white hover:bg-rose-600 focus:outline focus:outline-2 focus:outline-rose-500"
          >
            আবার চেষ্টা করুন
          </button>
        </div>
      </div>
    </div>
  );
}
