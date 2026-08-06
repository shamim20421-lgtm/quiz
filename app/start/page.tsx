"use client";

import { useRouter } from "next/navigation";
import { ArrowRight, MessageSquareText } from "lucide-react";
import { useState } from "react";
import { useSessionState } from "@/lib/session-context";
import type { ProblemType } from "@/lib/types";

const problems: { label: string; type: ProblemType; direct?: boolean }[] = [
  { label: "সে আগের মতো বার্তা পাঠায় না", type: "not_texting" },
  { label: "সে উত্তর দিতে দেরি করে", type: "late_reply" },
  { label: "সে কি আগ্রহ হারাচ্ছে?", type: "losing_interest" },
  { label: "সে আমাকে এড়িয়ে চলছে", type: "avoiding_me" },
  { label: "ঝগড়ার পর কী করব?", type: "after_fight" },
  { label: "কী বার্তা পাঠাব?", type: "message_help", direct: true },
];

export default function StartPage() {
  const router = useRouter();
  const { setSession } = useSessionState();
  const [loadingType, setLoadingType] = useState<ProblemType | null>(null);
  const [error, setError] = useState("");

  async function startProblem(problem: { type: ProblemType; direct?: boolean }) {
    setError("");
    if (problem.direct) {
      router.push("/message");
      return;
    }

    setLoadingType(problem.type);
    try {
      const response = await fetch("/api/quiz/start", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ problemType: problem.type }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setSession(data.sessionToken, data.problemType);
      router.push("/quiz/interest");
    } catch {
      setError("শুরু করা যায়নি। আবার চেষ্টা করুন।");
    } finally {
      setLoadingType(null);
    }
  }

  return (
    <div className="min-h-[calc(100svh-9rem)] px-4 py-8">
      <div className="mx-auto max-w-[520px]">
        <p className="text-sm font-semibold text-rose-200">প্রথম যাচাই এখন চালু</p>
        <h1 className="mt-3 text-3xl font-black text-white">আজ আপনার সমস্যাটা কী?</h1>
        <div className="mt-7 grid gap-3">
          {problems.map((problem, index) => (
            <button
              key={problem.type}
              type="button"
              disabled={loadingType !== null}
              onClick={() => void startProblem(problem)}
              className="flex min-h-20 items-center justify-between gap-4 rounded-3xl border border-white/10 bg-white p-4 text-left font-bold text-slate-900 transition hover:border-rose-300 hover:bg-rose-50 focus:outline focus:outline-2 focus:outline-rose-300 disabled:cursor-wait disabled:opacity-70"
            >
              <span>
                {problem.label}
                {index < 5 ? <span className="mt-1 block text-sm font-medium text-rose-700">Relationship Check</span> : null}
              </span>
              {problem.direct ? <MessageSquareText aria-hidden="true" className="h-5 w-5 text-rose-600" /> : <ArrowRight aria-hidden="true" className="h-5 w-5 text-rose-600" />}
            </button>
          ))}
        </div>
        <p aria-live="polite" className="mt-4 min-h-6 text-sm text-rose-100">
          {error}
        </p>
      </div>
    </div>
  );
}
