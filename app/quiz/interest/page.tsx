"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Clock, FileText, RotateCcw, ShieldCheck } from "lucide-react";
import { AnswerOption } from "@/components/answer-option";
import { ProgressBar } from "@/components/progress-bar";
import { assessmentQuestions } from "@/lib/assessment/questions";
import { useSessionState } from "@/lib/session-context";

export default function QuizInterestPage() {
  const router = useRouter();
  const { sessionToken, setAnswer, answers } = useSessionState();
  const [intro, setIntro] = useState(true);
  const [index, setIndex] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const question = assessmentQuestions[index];

  useEffect(() => {
    if (!sessionToken) router.replace("/start");
  }, [router, sessionToken]);

  async function choose(answerKey: string) {
    if (!sessionToken) return;
    setSaving(true);
    setError("");
    try {
      const response = await fetch("/api/quiz/answer", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ sessionToken, questionKey: question.key, answerKey }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setAnswer(question.key, answerKey);
      if (index === assessmentQuestions.length - 1) router.push("/analyzing");
      else setIndex((current) => current + 1);
    } catch {
      setError("উত্তরটি সংরক্ষণ হয়নি। আবার চেষ্টা করুন।");
    } finally {
      setSaving(false);
    }
  }

  if (intro) {
    return (
      <div className="min-h-[calc(100svh-9rem)] px-4 py-8">
        <section className="mx-auto max-w-[520px] rounded-3xl bg-white p-6 text-slate-900">
          <h1 className="text-3xl font-black">শুরু করার আগে</h1>
          <div className="mt-6 grid gap-3">
            {[
              [Clock, "প্রায় এক মিনিট লাগবে"],
              [FileText, "দশটি প্রশ্ন"],
              [ShieldCheck, "ব্যক্তিগত ফলাফল"],
              [RotateCcw, "উত্তর পরিবর্তন করা যাবে"],
            ].map(([Icon, text]) => (
              <div key={String(text)} className="flex items-center gap-3 rounded-2xl border border-rose-100 p-4">
                <Icon aria-hidden="true" className="h-5 w-5 text-rose-600" />
                <span className="font-semibold">{String(text)}</span>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setIntro(false)}
            className="mt-7 min-h-14 w-full rounded-full bg-rose-500 px-5 font-bold text-white hover:bg-rose-600 focus:outline focus:outline-2 focus:outline-rose-500"
          >
            শুরু করুন
          </button>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100svh-9rem)] px-4 py-8">
      <section className="mx-auto max-w-[520px] rounded-3xl bg-[#fff8fb] p-5 text-slate-900">
        <ProgressBar value={index + 1} max={assessmentQuestions.length} />
        <p className="mt-5 text-sm font-bold text-rose-700">প্রশ্ন {index + 1} / ১০</p>
        <h1 className="mt-3 text-2xl font-black leading-snug">{question.text}</h1>
        <div className="mt-6 grid gap-3">
          {question.answers.map((answer) => (
            <AnswerOption key={answer.key} text={answer.text} selected={answers[question.key] === answer.key} disabled={saving} onSelect={() => void choose(answer.key)} />
          ))}
        </div>
        <div className="mt-5 flex items-center justify-between gap-3">
          {index > 0 ? (
            <button
              type="button"
              onClick={() => {
                setError("");
                setIndex((current) => current - 1);
              }}
              className="inline-flex min-h-12 items-center gap-2 rounded-full border border-slate-300 px-4 font-semibold text-slate-800 focus:outline focus:outline-2 focus:outline-rose-500"
            >
              <ArrowLeft aria-hidden="true" className="h-4 w-4" />
              আগের প্রশ্ন
            </button>
          ) : (
            <span />
          )}
          <p className="text-sm text-slate-500">{saving ? "সংরক্ষণ হচ্ছে..." : ""}</p>
        </div>
        <div aria-live="polite" className="mt-3 min-h-6 text-sm font-semibold text-rose-700">
          {error ? (
            <button type="button" onClick={() => setError("")} className="underline">
              {error}
            </button>
          ) : null}
        </div>
      </section>
    </div>
  );
}
