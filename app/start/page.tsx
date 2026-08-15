"use client";

import { useRouter } from "next/navigation";
import { ArrowRight, Clock3, MessageSquareText } from "lucide-react";
import { useRef, useState } from "react";
import { BanglaNumberText } from "@/components/bangla-number-text";
import { ButtonSpinner } from "@/components/button-spinner";
import { ErrorDialog } from "@/components/error-dialog";
import { trackEvent } from "@/lib/analytics";
import { useSessionState } from "@/lib/session-context";
import type { ProblemType } from "@/lib/types";

const problems: { icon: string; label: string; detail: string; tag: string; type: ProblemType; direct?: boolean }[] = [
  { icon: "💬", label: "আগে নিজেই মেসেজ করত...", detail: "এখন আর করে না।", tag: "১ মিনিট", type: "not_texting" },
  { icon: "📱", label: "সে ৮ ঘণ্টা পর রিপ্লাই দেয়।", detail: "আমি কি অপেক্ষা করব?", tag: "AI বিশ্লেষণ", type: "late_reply" },
  { icon: "❤️", label: "সে বদলে গেছে।", detail: "কথায় আগের উষ্ণতা নেই।", tag: "১ মিনিট", type: "losing_interest" },
  { icon: "↘", label: "সে আমাকে এড়িয়ে চলছে।", detail: "কথা বা দেখা করার সময় দিচ্ছে না।", tag: "AI বিশ্লেষণ", type: "avoiding_me" },
  { icon: "…", label: "আমরা ঝগড়া করেছি।", detail: "এখন কীভাবে কথা শুরু করব?", tag: "১ মিনিট", type: "after_fight" },
  { icon: "✍", label: "আমি কী লিখব?", detail: "তিনটি বাংলা বার্তা তৈরি করুন।", tag: "বার্তা", type: "message_help", direct: true },
];

export default function StartPage() {
  const router = useRouter();
  const { setSession } = useSessionState();
  const [loadingType, setLoadingType] = useState<ProblemType | null>(null);
  const [error, setError] = useState("");
  const [retryProblem, setRetryProblem] = useState<{ type: ProblemType; direct?: boolean } | null>(null);
  const startingRef = useRef(false);

  async function startProblem(problem: { type: ProblemType; direct?: boolean }) {
    if (loadingType !== null || startingRef.current) return;
    setError("");
    if (problem.direct) {
      router.push("/message");
      return;
    }

    startingRef.current = true;
    setLoadingType(problem.type);
    setRetryProblem(problem);
    try {
      const response = await fetch("/api/quiz/start", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ problemType: problem.type }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setSession(data.sessionToken, data.problemType);
      const trackedKey = `quiz_started:${data.sessionToken}`;
      if (sessionStorage.getItem(trackedKey) !== "true") {
        sessionStorage.setItem(trackedKey, "true");
        trackEvent("quiz_started", { source: "homepage" });
      }
      router.push("/quiz/interest");
    } catch {
      setError("কিছু সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    } finally {
      startingRef.current = false;
      setLoadingType(null);
    }
  }

  return (
    <div className="min-h-[calc(100svh-9rem)] px-4 py-8">
      <div className="mx-auto max-w-[520px]">
        <p className="text-sm font-semibold text-rose-200">আপনার পাশে ছোট AI সহায়ক</p>
        <h1 className="mt-3 text-3xl font-bold leading-tight text-white">আজ আপনার মনে কোন প্রশ্নটা ঘুরছে?</h1>
        <p className="mt-3 leading-7 text-slate-300">যেটা এখন সবচেয়ে বেশি ভাবাচ্ছে, সেটি বেছে নিন।</p>
        <div className="mt-7 grid gap-3">
          {problems.map((problem) => {
            const isLoading = loadingType === problem.type;

            return (
            <button
              key={problem.type}
              type="button"
              disabled={loadingType !== null}
              onClick={() => void startProblem(problem)}
              className="grid min-h-24 grid-cols-[2.5rem_1fr_auto] items-center gap-4 rounded-3xl border border-white/10 bg-white p-4 text-left text-slate-900 transition hover:border-rose-300 hover:bg-rose-50 focus:outline focus:outline-2 focus:outline-rose-300 disabled:cursor-wait disabled:opacity-70"
              aria-busy={isLoading}
            >
              <span aria-hidden="true" className="text-2xl">{problem.icon}</span>
              <span className="min-w-0">
                <span className="block font-semibold leading-6">{problem.label}</span>
                <span className="mt-1 block text-sm font-normal leading-6 text-slate-600">
                  <BanglaNumberText text={problem.detail} />
                </span>
                <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-rose-50 px-2 py-1 text-xs font-semibold text-rose-700">
                  <Clock3 aria-hidden="true" className="h-3 w-3" />
                  {isLoading ? (
                    <>
                      <ButtonSpinner />
                      শুরু হচ্ছে...
                    </>
                  ) : (
                    <BanglaNumberText text={problem.tag} />
                  )}
                </span>
              </span>
              {problem.direct ? <MessageSquareText aria-hidden="true" className="h-5 w-5 text-rose-600" /> : <ArrowRight aria-hidden="true" className="h-5 w-5 text-rose-600" />}
            </button>
          );
          })}
        </div>
        <p aria-live="polite" className="mt-4 min-h-6 text-sm text-rose-100">{loadingType ? "আপনার যাচাই শুরু করা হচ্ছে..." : ""}</p>
      </div>
      {error ? (
        <ErrorDialog
          title="যাচাই শুরু হয়নি"
          message={error}
          onClose={() => setError("")}
          onRetry={() => {
            if (retryProblem) void startProblem(retryProblem);
          }}
        />
      ) : null}
    </div>
  );
}
