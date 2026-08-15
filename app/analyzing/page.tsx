"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LoadingState } from "@/components/loading-state";
import { trackEvent } from "@/lib/analytics";
import { useSessionState } from "@/lib/session-context";

const rotating = ["যোগাযোগের ধরন দেখা হচ্ছে", "আচরণের পরিবর্তন মিলিয়ে দেখা হচ্ছে", "আপনার জন্য পরবর্তী পদক্ষেপ তৈরি হচ্ছে"];

export default function AnalyzingPage() {
  const router = useRouter();
  const { sessionToken } = useSessionState();
  const [line, setLine] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function complete() {
    if (!sessionToken) {
      router.replace("/start");
      return;
    }
    setError("");
    setLoading(true);
    const delay = new Promise((resolve) => setTimeout(resolve, 3000));
    try {
      const responsePromise = fetch("/api/quiz/complete", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ sessionToken }),
      });
      const [response] = await Promise.all([responsePromise, delay]);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      trackEvent("quiz_completed", { result_type: data.resultType, score: data.score });
      router.push("/result");
    } catch {
      setError("ফলাফল তৈরি করা যায়নি। আবার চেষ্টা করুন।");
      setLoading(false);
    }
  }

  useEffect(() => {
    const interval = setInterval(() => setLine((current) => (current + 1) % rotating.length), 900);
    void complete();
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionToken]);

  return (
    <div className="min-h-[calc(100svh-9rem)] px-4 py-8">
      <div className="mx-auto max-w-[520px]">
        {loading ? <LoadingState title="আপনার উত্তর বিশ্লেষণ করা হচ্ছে..." text={rotating[line]} /> : null}
        {error ? (
          <div className="rounded-3xl bg-white p-6 text-center text-slate-900">
            <p aria-live="polite" className="font-semibold text-rose-700">{error}</p>
            <button type="button" onClick={() => void complete()} className="mt-5 min-h-12 rounded-full bg-rose-500 px-5 font-bold text-white focus:outline focus:outline-2 focus:outline-rose-500">
              আবার চেষ্টা করুন
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
