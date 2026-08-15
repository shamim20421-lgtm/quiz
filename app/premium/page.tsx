"use client";

import Link from "next/link";
import { LockKeyhole } from "lucide-react";
import { useEffect, useRef } from "react";
import { trackEvent } from "@/lib/analytics";

const items = ["আপনার পরিস্থিতির বিস্তারিত ব্যাখ্যা", "আজ কী করবেন", "আজ কী করবেন না", "আগামী তিন দিনের পরিকল্পনা", "সম্ভাব্য কারণগুলো", "তিনটি প্রস্তুত বাংলা বার্তা", "পরবর্তী কথোপকথনের দিকনির্দেশনা"];

export default function PremiumPage() {
  const trackedPremiumView = useRef(false);

  useEffect(() => {
    if (trackedPremiumView.current) return;
    trackedPremiumView.current = true;
    trackEvent("premium_viewed");
  }, []);

  return (
    <div className="min-h-[calc(100svh-9rem)] px-4 py-8">
      <section className="mx-auto max-w-[520px] rounded-3xl bg-white p-6 text-slate-900">
        <LockKeyhole aria-hidden="true" className="h-8 w-8 text-rose-600" />
        <h1 className="mt-4 text-3xl font-bold">আপনার ব্যক্তিগত করণীয় পরিকল্পনা</h1>
        <p className="mt-3 text-4xl font-bold text-rose-700">৳১৯৯</p>
        <p className="mt-2 leading-7 text-slate-600">আপনার উত্তরের ভিত্তিতে তৈরি বিস্তারিত দিকনির্দেশনা</p>
        <p className="mt-1 text-sm font-semibold text-slate-500">একবারের পেমেন্ট</p>
        <div className="mt-6 grid gap-3">
          {items.map((item) => (
            <div key={item} className="rounded-2xl border border-rose-100 p-4 font-semibold">{item}</div>
          ))}
        </div>
        <Link href="/payment" className="mt-7 block min-h-14 rounded-full bg-rose-500 px-5 py-4 text-center font-semibold text-white hover:bg-rose-600 focus:outline focus:outline-2 focus:outline-rose-500" onClick={() => trackEvent("premium_clicked")}>
          আমার করণীয় আনলক করুন
        </Link>
      </section>
    </div>
  );
}
