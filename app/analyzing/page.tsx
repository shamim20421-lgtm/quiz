"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { ButtonSpinner } from "@/components/button-spinner";
import { trackEvent } from "@/lib/analytics";
import { trackMetaCustomEvent } from "@/lib/meta-pixel";
import { useSessionState } from "@/lib/session-context";

const steps = ["যোগাযোগের ধরন দেখা হচ্ছে", "সাম্প্রতিক পরিবর্তন মিলিয়ে দেখা হচ্ছে", "আপনার করণীয় প্রস্তুত করা হচ্ছে"];

function getProcessingDelay() {
  if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return 350;
  }

  return 1700;
}

export default function AnalyzingPage() {
  const router = useRouter();
  const { sessionToken } = useSessionState();
  const [activeStep, setActiveStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [processingComplete, setProcessingComplete] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const completingRef = useRef(false);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  function clearProcessingTimers() {
    timersRef.current.forEach((timer) => clearTimeout(timer));
    timersRef.current = [];
  }

  function startProcessingAnimation() {
    clearProcessingTimers();
    setActiveStep(0);
    setProgress(0);
    setProcessingComplete(false);

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timings = reducedMotion ? [70, 140, 240, 320] : [350, 850, 1350, 1650];

    timersRef.current = [
      setTimeout(() => setProgress(35), timings[0]),
      setTimeout(() => {
        setActiveStep(1);
        setProgress(70);
      }, timings[1]),
      setTimeout(() => setActiveStep(2), timings[2]),
      setTimeout(() => {
        setProgress(100);
        setProcessingComplete(true);
      }, timings[3]),
    ];
  }

  async function complete() {
    if (completingRef.current) return;
    if (!sessionToken) {
      router.replace("/start");
      return;
    }
    completingRef.current = true;
    setError("");
    setLoading(true);
    startProcessingAnimation();
    const processingDelay = new Promise((resolve) => setTimeout(resolve, getProcessingDelay()));
    try {
      const responsePromise = fetch("/api/quiz/complete", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ sessionToken }),
      });
      const [response] = await Promise.all([responsePromise, processingDelay]);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      const trackedKey = `quiz_completed:${sessionToken}`;
      if (sessionStorage.getItem(trackedKey) !== "true") {
        sessionStorage.setItem(trackedKey, "true");
        trackEvent("quiz_completed", { total_questions: 10 });
        trackMetaCustomEvent("QuizCompleted");
      }
      router.push("/result");
    } catch {
      setError("কিছু সমস্যা হয়েছে। আবার চেষ্টা করুন।");
      setLoading(false);
    } finally {
      completingRef.current = false;
    }
  }

  useEffect(() => {
    void complete();
    return () => clearProcessingTimers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionToken]);

  return (
    <div className="min-h-[calc(100svh-9rem)] px-4 py-8">
      <div className="mx-auto max-w-[520px]">
        {loading ? (
          <section role="status" aria-live="polite" className="rounded-3xl bg-white p-6 text-slate-900 shadow-sm transition duration-300 ease-out motion-reduce:transition-none">
            <h1 className="text-2xl font-bold">আপনার উত্তরগুলো দেখা হচ্ছে...</h1>
            <p className="mt-3 leading-7 text-slate-600">আপনার পরিস্থিতির সঙ্গে উত্তরগুলো মিলিয়ে দেখা হচ্ছে।</p>

            <div className="mt-6 h-2 overflow-hidden rounded-full bg-rose-100">
              <div className="h-full rounded-full bg-rose-500 transition-all duration-500 ease-out motion-reduce:transition-none" style={{ width: `${progress}%` }} />
            </div>

            <div className="mt-6 grid gap-3">
              {steps.map((step, index) => {
                const isCompleted = processingComplete || index < activeStep;
                const isActive = !processingComplete && index === activeStep;

                return (
                  <div key={step} className="flex items-center gap-3 rounded-2xl border border-rose-100 p-4">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-rose-50 text-rose-700">
                      {isCompleted ? <Check aria-hidden="true" className="h-4 w-4" /> : isActive ? <ButtonSpinner /> : null}
                    </span>
                    <span className={isActive || isCompleted ? "font-semibold" : "text-slate-500"}>{step}</span>
                  </div>
                );
              })}
            </div>

            <p className="mt-5 min-h-6 text-center text-sm font-semibold text-rose-700">{processingComplete ? "সম্পন্ন ✓" : "বিশ্লেষণ করা হচ্ছে..."}</p>
          </section>
        ) : null}
        {error ? (
          <div className="rounded-3xl bg-white p-6 text-center text-slate-900">
            <p aria-live="polite" className="font-semibold text-rose-700">{error}</p>
            <button type="button" disabled={loading} onClick={() => void complete()} className="mt-5 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-rose-500 px-5 font-semibold text-white focus:outline focus:outline-2 focus:outline-rose-500 disabled:cursor-wait disabled:opacity-70" aria-busy={loading}>
              {loading ? (
                <>
                  <ButtonSpinner />
                  বিশ্লেষণ করা হচ্ছে...
                </>
              ) : (
                "আবার চেষ্টা করুন"
              )}
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
