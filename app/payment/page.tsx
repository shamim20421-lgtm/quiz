"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { trackEvent } from "@/lib/analytics";
import { useSessionState } from "@/lib/session-context";

export default function PaymentPage() {
  const router = useRouter();
  const { sessionToken } = useSessionState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const trackedPaymentView = useRef(false);

  useEffect(() => {
    if (trackedPaymentView.current) return;
    trackedPaymentView.current = true;
    trackEvent("payment_viewed");
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!sessionToken) {
      router.push("/start");
      return;
    }
    const form = new FormData(event.currentTarget);
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/payment/demo", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          sessionToken,
          name: form.get("name"),
          mobileNumber: form.get("mobileNumber"),
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setSuccess(true);
    } catch {
      setError("তথ্য সংরক্ষণ করা যায়নি। আবার চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="min-h-[calc(100svh-9rem)] px-4 py-8">
        <section className="mx-auto max-w-[520px] rounded-3xl bg-white p-6 text-center text-slate-900">
          <h1 className="text-3xl font-bold">ধন্যবাদ ❤️</h1>
          <p className="mt-3 leading-7 text-slate-600">আপনার তথ্য সফলভাবে সংরক্ষণ করা হয়েছে।</p>
          <p className="mt-1 leading-7 text-slate-600">আমাদের AI সম্পর্ক সহায়ক সবার জন্য চালু হলে আমরা আপনাকে প্রথম দিকেই জানিয়ে দেব।</p>
          <p className="mt-1 leading-7 text-slate-600">আপনার সম্পর্কের সিদ্ধান্তে আরও স্পষ্টতা পেতে আমরা পাশে আছি।</p>
          <button type="button" onClick={() => router.push("/start")} className="mt-7 min-h-14 w-full rounded-full bg-rose-500 px-5 font-semibold text-white hover:bg-rose-600 focus:outline focus:outline-2 focus:outline-rose-500">
            আরও একটি পরিস্থিতি দেখুন
          </button>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100svh-9rem)] px-4 py-8">
      <form onSubmit={submit} className="mx-auto max-w-[520px] rounded-3xl bg-white p-6 text-slate-900">
        <p className="text-sm font-semibold text-rose-700">পরীক্ষামূলক ধাপ</p>
        <h1 className="mt-2 text-3xl font-bold">ডেমো পেমেন্ট</h1>
        <p className="mt-3 leading-7 text-slate-600">এটি পরীক্ষামূলক ধাপ। কোনো বাস্তব টাকা কাটা হবে না।</p>
        <div className="mt-6 grid gap-4">
          <label className="grid gap-2 font-semibold">
            নাম
            <input name="name" required className="min-h-12 rounded-2xl border border-slate-300 px-4 focus:outline focus:outline-2 focus:outline-rose-500" />
          </label>
          <label className="grid gap-2 font-semibold">
            মোবাইল নম্বর
            <input name="mobileNumber" required className="min-h-12 rounded-2xl border border-slate-300 px-4 focus:outline focus:outline-2 focus:outline-rose-500" />
            <span className="text-sm font-normal leading-6 text-slate-500">আপনার নম্বর শুধু আগাম অ্যাক্সেস ও পরীক্ষামূলক যোগাযোগের জন্য ব্যবহার হবে।</span>
          </label>
          <label className="grid gap-2 font-semibold">
            আপনার মতামত (ঐচ্ছিক)
            <textarea name="feedback" rows={4} className="rounded-2xl border border-slate-300 p-4 leading-7 focus:outline focus:outline-2 focus:outline-rose-500" />
          </label>
        </div>
        <p aria-live="polite" className="mt-4 min-h-6 text-sm font-semibold text-rose-700">{error}</p>
        <button disabled={loading} className="mt-3 min-h-14 w-full rounded-full bg-rose-500 px-5 font-semibold text-white hover:bg-rose-600 focus:outline focus:outline-2 focus:outline-rose-500 disabled:opacity-70">
          {loading ? "সংরক্ষণ হচ্ছে..." : "আগাম অ্যাক্সেস চাই"}
        </button>
      </form>
    </div>
  );
}
