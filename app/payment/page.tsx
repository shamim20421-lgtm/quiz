"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, CheckCircle2 } from "lucide-react";
import { ButtonSpinner } from "@/components/button-spinner";
import { trackEvent } from "@/lib/analytics";
import { useSessionState } from "@/lib/session-context";

const successCards = [
  "🔒 আপনার তথ্য নিরাপদে সংরক্ষিত হয়েছে",
  "📱 চালু হলে SMS/WhatsApp-এ জানানো হবে",
  "❤️ ধন্যবাদ আমাদের প্রথম ব্যবহারকারী হওয়ার জন্য",
];

export default function PaymentPage() {
  const router = useRouter();
  const { sessionToken } = useSessionState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);
  const trackedPaymentView = useRef(false);
  const submittingRef = useRef(false);

  useEffect(() => {
    if (trackedPaymentView.current) return;
    trackedPaymentView.current = true;
    trackEvent("payment_viewed");
  }, []);

  useEffect(() => {
    if (!success) return;
    const frame = requestAnimationFrame(() => setSuccessVisible(true));
    return () => cancelAnimationFrame(frame);
  }, [success]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading || submittingRef.current) return;
    if (!sessionToken) {
      router.push("/start");
      return;
    }
    submittingRef.current = true;
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
      setSuccessVisible(false);
      setSuccess(true);
    } catch {
      setError("তথ্য সংরক্ষণ করা যায়নি। আবার চেষ্টা করুন।");
    } finally {
      submittingRef.current = false;
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="min-h-[calc(100svh-9rem)] px-4 py-8">
        <section className={`mx-auto max-w-[520px] rounded-3xl bg-white p-6 text-center text-slate-900 transition duration-300 ease-out ${successVisible ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"}`}>
          <div className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-50 text-green-600 transition duration-300 ease-out ${successVisible ? "scale-100" : "scale-90"}`}>
            <CheckCircle2 aria-hidden="true" className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-bold">ধন্যবাদ ❤️</h1>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 text-sm font-semibold text-green-700">
            <Check aria-hidden="true" className="h-4 w-4" />
            আপনার নিবন্ধন সম্পন্ন হয়েছে
          </div>
          <div className="mt-5 space-y-3 leading-7 text-slate-600">
            <p>আপনার তথ্য সফলভাবে সংরক্ষণ করা হয়েছে।</p>
            <p>আপনি এখন আমাদের প্রাথমিক অপেক্ষমান তালিকায় (Early Access List) যুক্ত হয়েছেন।</p>
            <p>আমরা সীমিত সংখ্যক ব্যবহারকারীকে ধাপে ধাপে আমন্ত্রণ জানাব।</p>
            <p>আপনার নম্বর এলে SMS বা WhatsApp-এর মাধ্যমে জানিয়ে দেওয়া হবে।</p>
          </div>
          <div className="mt-6 grid gap-3">
            {successCards.map((item) => (
              <div key={item} className="rounded-2xl border border-rose-100 p-4 text-left font-semibold">
                {item}
              </div>
            ))}
          </div>
          <button type="button" onClick={() => router.push("/start")} className="mt-7 min-h-14 w-full rounded-full bg-rose-500 px-5 font-semibold text-white hover:bg-rose-600 focus:outline focus:outline-2 focus:outline-rose-500">
            হোমে ফিরে যান
          </button>
          <button type="button" className="mt-4 rounded-full px-5 py-3 text-sm font-semibold text-rose-700 underline focus:outline focus:outline-2 focus:outline-rose-500">
            বন্ধুকে শেয়ার করুন
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
        <button disabled={loading} className="mt-3 inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-full bg-rose-500 px-5 font-semibold text-white hover:bg-rose-600 focus:outline focus:outline-2 focus:outline-rose-500 disabled:cursor-wait disabled:opacity-70" aria-busy={loading}>
          {loading ? (
            <>
              <ButtonSpinner />
              সংরক্ষণ করা হচ্ছে...
            </>
          ) : (
            "আগাম অ্যাক্সেস চাই"
          )}
        </button>
      </form>
    </div>
  );
}
