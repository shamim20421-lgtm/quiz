"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useSessionState } from "@/lib/session-context";

export default function PaymentPage() {
  const router = useRouter();
  const { sessionToken } = useSessionState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
          transactionId: form.get("transactionId"),
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      router.push("/report");
    } catch {
      setError("ডেমো পেমেন্ট সম্পন্ন হয়নি। আবার চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[calc(100svh-9rem)] px-4 py-8">
      <form onSubmit={submit} className="mx-auto max-w-[520px] rounded-3xl bg-white p-6 text-slate-900">
        <p className="text-sm font-bold text-rose-700">পরীক্ষামূলক ধাপ</p>
        <h1 className="mt-2 text-3xl font-black">ডেমো পেমেন্ট</h1>
        <p className="mt-3 leading-7 text-slate-600">পরীক্ষার সময় কোনো বাস্তব টাকা কাটা হবে না। কার্ডের তথ্য প্রয়োজন নেই।</p>
        <div className="mt-6 grid gap-4">
          <label className="grid gap-2 font-semibold">
            নাম
            <input name="name" required className="min-h-12 rounded-2xl border border-slate-300 px-4 focus:outline focus:outline-2 focus:outline-rose-500" />
          </label>
          <label className="grid gap-2 font-semibold">
            মোবাইল নম্বর
            <input name="mobileNumber" required className="min-h-12 rounded-2xl border border-slate-300 px-4 focus:outline focus:outline-2 focus:outline-rose-500" />
          </label>
          <label className="grid gap-2 font-semibold">
            লেনদেন নম্বর
            <input name="transactionId" required className="min-h-12 rounded-2xl border border-slate-300 px-4 focus:outline focus:outline-2 focus:outline-rose-500" />
          </label>
        </div>
        <p aria-live="polite" className="mt-4 min-h-6 text-sm font-semibold text-rose-700">{error}</p>
        <button disabled={loading} className="mt-3 min-h-14 w-full rounded-full bg-rose-500 px-5 font-bold text-white hover:bg-rose-600 focus:outline focus:outline-2 focus:outline-rose-500 disabled:opacity-70">
          {loading ? "সম্পন্ন হচ্ছে..." : "ডেমো পেমেন্ট সম্পন্ন করুন"}
        </button>
      </form>
    </div>
  );
}
