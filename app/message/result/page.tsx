"use client";

import Link from "next/link";
import { Copy } from "lucide-react";
import { useEffect, useState } from "react";

type MessageResult = {
  toneLabel: string;
  messages: string[];
};

export default function MessageResultPage() {
  const [result, setResult] = useState<MessageResult | null>(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    const raw = sessionStorage.getItem("messageResult");
    if (raw) setResult(JSON.parse(raw));
  }, []);

  async function copy(text: string) {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(text);
      setStatus("বার্তাটি কপি হয়েছে।");
      return;
    }
    setStatus("বার্তাটি নির্বাচন করে কপি করুন।");
  }

  if (!result) {
    return (
      <div className="mx-auto max-w-[520px] px-4 py-8">
        <div className="rounded-3xl bg-white p-6 text-center text-slate-900">
          <p>এখনো কোনো বার্তা তৈরি হয়নি।</p>
          <Link href="/message" className="mt-5 inline-block rounded-full bg-rose-500 px-5 py-3 font-semibold text-white">আবার তৈরি করুন</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100svh-9rem)] px-4 py-8">
      <section className="mx-auto max-w-[520px]">
        <h1 className="text-3xl font-bold text-white">তৈরি করা বার্তা</h1>
        <p className="mt-2 text-rose-100">ভঙ্গি: {result.toneLabel}</p>
        <div className="mt-6 grid gap-4">
          {result.messages.map((message, index) => (
            <article key={message} className="rounded-3xl bg-white p-5 text-slate-900">
              <h2 className="font-semibold">বার্তা {index + 1}</h2>
              <p className="mt-3 select-text whitespace-pre-wrap leading-7 text-slate-700">{message}</p>
              <button type="button" onClick={() => void copy(message)} className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-full border border-rose-200 px-4 font-semibold text-rose-700 focus:outline focus:outline-2 focus:outline-rose-500">
                <Copy aria-hidden="true" className="h-4 w-4" />
                কপি করুন
              </button>
            </article>
          ))}
        </div>
        <p aria-live="polite" className="mt-4 min-h-6 text-sm text-rose-100">{status}</p>
        <div className="mt-4 flex flex-col gap-3">
          <Link href="/message" className="min-h-14 rounded-full bg-rose-500 px-5 py-4 text-center font-semibold text-white">আবার তৈরি করুন</Link>
          <Link href="/message" className="rounded-full px-5 py-3 text-center font-semibold text-rose-100 underline">অন্য ভঙ্গি বেছে নিন</Link>
        </div>
      </section>
    </div>
  );
}
