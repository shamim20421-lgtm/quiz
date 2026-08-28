"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ButtonSpinner } from "@/components/button-spinner";
import { LoadingState } from "@/components/loading-state";
import { BanglaNumberText } from "@/components/bangla-number-text";
import { ReportSection } from "@/components/report-section";
import { useSessionState } from "@/lib/session-context";

type Report = {
  full_summary: string;
  communication_pattern: string;
  possible_reasons: string[];
  action_plan: string[];
  mistakes_to_avoid: string[];
  suggested_conversation: string;
  relationship_insight: string;
  suggested_messages: string[];
  is_unlocked: boolean;
};

export default function ReportPage() {
  const router = useRouter();
  const { sessionToken, isSessionLoaded } = useSessionState();
  const [report, setReport] = useState<Report | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const loadingRef = useRef(false);

  async function load() {
    if (loadingRef.current) return;
    if (!isSessionLoaded) return;
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
      if (!payload.report.is_unlocked) {
        router.replace("/premium");
        return;
      }
      setReport(payload.report);
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
  }, [isSessionLoaded, sessionToken]);

  if (loading && !report && !error) return <div className="mx-auto max-w-[520px] px-4 py-8"><LoadingState title="রিপোর্ট আনা হচ্ছে..." /></div>;

  return (
    <div className="px-4 py-8">
      <div className="mx-auto grid max-w-[520px] gap-4">
        {error ? (
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
        ) : null}
        {report ? (
          <>
            <h1 className="text-3xl font-bold text-white">❤️ আপনার জন্য করণীয়</h1>
            <ReportSection title="আপনার পরিস্থিতির সারাংশ"><p>{report.full_summary}</p></ReportSection>
            <ReportSection title="যোগাযোগের বর্তমান ধরন"><p>{report.communication_pattern}</p></ReportSection>
            <ReportSection title="সম্ভাব্য কারণগুলো"><ul className="list-disc space-y-2 pl-5">{report.possible_reasons.map((item) => <li key={item}>{item}</li>)}</ul></ReportSection>
            <ReportSection title="আজ থেকে তিন দিনের পরিকল্পনা"><ul className="space-y-2">{report.action_plan.map((item) => <li key={item}><BanglaNumberText text={item} /></li>)}</ul></ReportSection>
            <ReportSection title="যেসব ভুল এড়িয়ে চলবেন"><ul className="list-disc space-y-2 pl-5">{report.mistakes_to_avoid.map((item) => <li key={item}>{item}</li>)}</ul></ReportSection>
            <ReportSection title="পরবর্তী কথোপকথন কীভাবে শুরু করবেন"><p>{report.suggested_conversation}</p></ReportSection>
            <ReportSection title="সম্পর্ক নিয়ে গুরুত্বপূর্ণ উপলব্ধি"><p>{report.relationship_insight}</p></ReportSection>
            <ReportSection title="তিনটি প্রস্তাবিত বার্তা"><div className="grid gap-3">{report.suggested_messages.map((item) => <p key={item} className="rounded-2xl bg-rose-50 p-4"><BanglaNumberText text={item} /></p>)}</div></ReportSection>
            <Link href="/message" className="min-h-14 rounded-full bg-rose-500 px-5 py-4 text-center font-semibold text-white hover:bg-rose-600 focus:outline focus:outline-2 focus:outline-rose-500">
              নিজের পরিস্থিতি অনুযায়ী বার্তা তৈরি করুন
            </Link>
          </>
        ) : null}
      </div>
    </div>
  );
}
