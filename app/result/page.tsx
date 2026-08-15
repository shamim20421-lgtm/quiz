"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { disclaimer, safetyMessage } from "@/components/site-footer";
import { ButtonSpinner } from "@/components/button-spinner";
import { LoadingState } from "@/components/loading-state";
import { trackEvent } from "@/lib/analytics";
import { useSessionState } from "@/lib/session-context";

type ResultData = {
  session: { score: number; result_type: string };
  report: { title: string; free_summary: string[]; immediate_action: string; avoid_today: string; sample_message: string };
};

export default function ResultPage() {
  const router = useRouter();
  const { sessionToken, clearSession } = useSessionState();
  const [data, setData] = useState<ResultData | null>(null);
  const [error, setError] = useState("");
  const trackedResultView = useRef<string | null>(null);
  const loadingRef = useRef(false);
  const [loading, setLoading] = useState(true);

  async function load() {
    if (loadingRef.current) return;
    if (!sessionToken) {
      router.replace("/start");
      return;
    }
    loadingRef.current = true;
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`/api/quiz/${sessionToken}`);
      const payload = await response.json();
      if (!response.ok || !payload.report) throw new Error(payload.error);
      setData(payload);
      if (trackedResultView.current !== sessionToken) {
        trackedResultView.current = sessionToken;
        trackEvent("result_viewed", { result_type: payload.session.result_type });
      }
    } catch {
      setError("কিছু সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionToken]);

  if (loading && !data && !error) {
    return <div className="mx-auto max-w-[520px] px-4 py-8"><LoadingState title="ফলাফল আনা হচ্ছে..." /></div>;
  }

  if (error) {
    return (
      <div className="mx-auto max-w-[520px] px-4 py-8">
        <div className="rounded-3xl bg-white p-6 text-center text-slate-900">
          <p aria-live="polite" className="font-semibold text-rose-700">{error}</p>
          <button type="button" disabled={loading} onClick={() => void load()} className="mt-5 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-rose-500 px-5 font-semibold text-white disabled:cursor-wait disabled:opacity-70" aria-busy={loading}>
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
      </div>
    );
  }

  return (
    <div className="px-4 py-8">
      <section className="mx-auto max-w-[520px] rounded-3xl bg-white p-6 text-slate-900">
        <h1 className="text-3xl font-bold leading-tight">{data!.report.title}</h1>
        <div className="mt-6">
          <h2 className="font-semibold">আপনার পরিস্থিতি</h2>
          <div className="mt-3 space-y-4 leading-7 text-slate-700">
            {data!.report.free_summary.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </div>
        </div>
        <div className="mt-6 rounded-2xl border border-rose-100 bg-rose-50 p-4">
          <h2 className="font-semibold">আজ কী করবেন</h2>
          <p className="mt-2 leading-7 text-slate-700">{data!.report.immediate_action}</p>
        </div>
        <div className="mt-4 rounded-2xl border border-slate-200 p-4">
          <h2 className="font-semibold">আজ কী করবেন না</h2>
          <p className="mt-2 leading-7 text-slate-700">{data!.report.avoid_today}</p>
        </div>
        <div className="mt-4 rounded-2xl border border-slate-200 p-4">
          <h2 className="font-semibold">এই বার্তাটি পাঠাতে পারেন</h2>
          <p className="mt-2 leading-7 text-slate-700">{data!.report.sample_message}</p>
        </div>
        <p className="mt-5 text-sm leading-6 text-slate-600">{disclaimer}</p>
        <p className="mt-3 text-sm leading-6 text-slate-600">{safetyMessage}</p>
        <div className="mt-6 rounded-2xl border border-rose-100 p-4">
          <h2 className="font-semibold">আপনার জন্য বিস্তারিত করণীয় দেখুন</h2>
          <p className="mt-2 leading-7 text-slate-600">কী লিখবেন, কী এড়িয়ে চলবেন এবং আগামী তিন দিনে কীভাবে এগোবেন—আপনার উত্তরের ভিত্তিতে দেখুন।</p>
        </div>
        <Link href="/premium" className="mt-7 block min-h-14 rounded-full bg-rose-500 px-5 py-4 text-center font-semibold text-white hover:bg-rose-600 focus:outline focus:outline-2 focus:outline-rose-500">
          আমার বিস্তারিত করণীয় দেখুন
        </Link>
        <button type="button" onClick={() => { clearSession(); router.push("/start"); }} className="mt-4 w-full rounded-full px-5 py-3 font-semibold text-rose-700 underline focus:outline focus:outline-2 focus:outline-rose-500">
          আবার যাচাই করুন
        </button>
      </section>
    </div>
  );
}
