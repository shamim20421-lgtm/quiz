"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Clock, FileText, RotateCcw, ShieldCheck, X } from "lucide-react";
import { AnswerOption } from "@/components/answer-option";
import { BanglaNumberText } from "@/components/bangla-number-text";
import { ProgressBar } from "@/components/progress-bar";
import { assessmentQuestions } from "@/lib/assessment/questions";
import { useSessionState } from "@/lib/session-context";

const banglaDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];

function toBanglaNumber(value: number) {
  return String(value).replace(/\d/g, (digit) => banglaDigits[Number(digit)]);
}

export default function QuizInterestPage() {
  const router = useRouter();
  const { sessionToken, setAnswer, answers } = useSessionState();
  const [intro, setIntro] = useState(true);
  const [index, setIndex] = useState(0);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [retryAnswerKey, setRetryAnswerKey] = useState<string | null>(null);
  const [selectedAnswerKey, setSelectedAnswerKey] = useState<string | null>(null);
  const [transitionStage, setTransitionStage] = useState<"entered" | "exiting" | "entering">("entered");
  const savingRef = useRef(false);
  const question = assessmentQuestions[index];
  const progressPercent = Math.round(((index + 1) / assessmentQuestions.length) * 100);

  useEffect(() => {
    if (!sessionToken) router.replace("/start");
  }, [router, sessionToken]);

  useEffect(() => {
    if (saving) return;
    setSelectedAnswerKey(answers[question.key] ?? null);
  }, [answers, question.key, saving]);

  function getQuestionTransitionDelay() {
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return 60;
    return 220;
  }

  async function moveToQuestion(nextIndex: number) {
    setTransitionStage("exiting");
    await new Promise((resolve) => setTimeout(resolve, getQuestionTransitionDelay()));
    setIndex(nextIndex);
    setSelectedAnswerKey(answers[assessmentQuestions[nextIndex].key] ?? null);
    setTransitionStage("entering");
    requestAnimationFrame(() => setTransitionStage("entered"));
  }

  async function choose(answerKey: string) {
    if (saving || savingRef.current) return;
    if (!sessionToken) return;
    savingRef.current = true;
    setSaving(true);
    setSaved(false);
    setError("");
    setRetryAnswerKey(answerKey);
    setSelectedAnswerKey(answerKey);
    try {
      const response = await fetch("/api/quiz/answer", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ sessionToken, questionKey: question.key, answerKey }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setAnswer(question.key, answerKey);
      setRetryAnswerKey(null);
      setSaved(true);
      await new Promise((resolve) => setTimeout(resolve, 225));
      if (index === assessmentQuestions.length - 1) router.push("/analyzing");
      else {
        await moveToQuestion(index + 1);
        setSaved(false);
      }
    } catch {
      setSaved(false);
      setError("উত্তরটি সংরক্ষণ করা যায়নি। আবার চেষ্টা করুন।");
    } finally {
      savingRef.current = false;
      setSaving(false);
    }
  }

  if (intro) {
    return (
      <div className="min-h-[calc(100svh-9rem)] px-4 py-8">
        <section className="mx-auto max-w-[520px] rounded-3xl bg-white p-6 text-slate-900">
          <div className="flex items-start justify-between gap-4">
            <button
              type="button"
              onClick={() => router.push("/start")}
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-slate-300 px-4 font-semibold text-slate-800 focus:outline focus:outline-2 focus:outline-rose-500"
            >
              <ArrowLeft aria-hidden="true" className="h-4 w-4" />
              ফিরে যান
            </button>
            <button
              type="button"
              onClick={() => router.push("/start")}
              aria-label="বন্ধ করুন"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-slate-200 text-slate-700 focus:outline focus:outline-2 focus:outline-rose-500"
            >
              <X aria-hidden="true" className="h-5 w-5" />
            </button>
          </div>
          <h1 className="mt-6 text-3xl font-bold">শুরু করার আগে</h1>
          <p className="mt-3 leading-7 text-slate-600">
            মাত্র <span className="bangla-number">১০</span>টি ছোট প্রশ্ন। আপনার পরিস্থিতি বুঝতে প্রায় <span className="bangla-number">১</span> মিনিট লাগবে।
          </p>
          <div className="mt-6 grid gap-3">
            {[
              [Clock, "প্রায় ১ মিনিট"],
              [FileText, "১০টি প্রশ্ন"],
              [ShieldCheck, "ব্যক্তিগত ফলাফল"],
              [RotateCcw, "আগের উত্তরে ফিরে যাওয়া যাবে"],
            ].map(([Icon, text]) => (
              <div key={String(text)} className="flex items-center gap-3 rounded-2xl border border-rose-100 p-4">
                <Icon aria-hidden="true" className="h-5 w-5 text-rose-600" />
                <span className="font-semibold">
                  <BanglaNumberText text={String(text)} />
                </span>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setIntro(false)}
            className="mt-7 min-h-14 w-full rounded-full bg-rose-500 px-5 font-semibold text-white hover:bg-rose-600 focus:outline focus:outline-2 focus:outline-rose-500"
          >
            শুরু করুন
          </button>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100svh-9rem)] px-4 py-8">
      <section className="relative mx-auto max-w-[520px] rounded-3xl bg-[#fff8fb] p-5 text-slate-900">
        <button
          type="button"
          onClick={() => router.push("/start")}
          className="absolute right-5 top-5 inline-flex min-h-11 items-center gap-2 rounded-full border border-rose-200 bg-white px-4 font-semibold text-rose-700 shadow-sm focus:outline focus:outline-2 focus:outline-rose-500"
        >
          <X aria-hidden="true" className="h-5 w-5" />
          বন্ধ করুন
        </button>
        <div className="pr-32 pt-4">
          <ProgressBar value={index + 1} max={assessmentQuestions.length} />
        </div>
        <div className={`transition duration-[220ms] ease-out motion-reduce:transition-none ${
          transitionStage === "entered"
            ? "translate-y-0 opacity-100"
            : transitionStage === "exiting"
              ? "-translate-y-1.5 opacity-0 motion-reduce:translate-y-0"
              : "translate-y-2 opacity-0 motion-reduce:translate-y-0"
        }`}>
          <p className="mt-4 text-sm font-semibold text-rose-700"><span className="bangla-number">{toBanglaNumber(progressPercent)}%</span> সম্পন্ন</p>
          <p className="sr-only">প্রশ্ন <span className="bangla-number">{toBanglaNumber(index + 1)}</span>, মোট <span className="bangla-number">১০</span>টি প্রশ্ন</p>
          <h1 className="mt-3 text-2xl font-bold leading-snug">
            <BanglaNumberText text={question.text} />
          </h1>
          <div className="mt-6 grid gap-3" role="radiogroup" aria-label={question.text}>
            {question.answers.map((answer) => (
              <AnswerOption key={answer.key} text={answer.text} selected={selectedAnswerKey === answer.key} disabled={saving} loading={saving && retryAnswerKey === answer.key} onSelect={() => void choose(answer.key)} />
            ))}
          </div>
        </div>
        <div className="mt-5 flex items-center justify-between gap-3">
          {index > 0 ? (
            <button
              type="button"
              disabled={saving}
              onClick={() => {
                setError("");
                setSaved(false);
                setRetryAnswerKey(null);
                void moveToQuestion(index - 1);
              }}
              className="inline-flex min-h-12 items-center gap-2 rounded-full border border-slate-300 px-4 font-semibold text-slate-800 focus:outline focus:outline-2 focus:outline-rose-500 disabled:cursor-wait disabled:opacity-70"
            >
              <ArrowLeft aria-hidden="true" className="h-4 w-4" />
              আগের প্রশ্ন
            </button>
          ) : (
            <span />
          )}
          <p aria-live="polite" className="text-sm text-slate-500">
            {saved ? "উত্তর সংরক্ষণ করা হয়েছে" : saving ? "সংরক্ষণ হচ্ছে..." : ""}
          </p>
        </div>
        <div aria-live="polite" className="mt-3 min-h-6 text-sm font-semibold text-rose-700">
          {error ? (
            <div>
              <p>{error}</p>
              {retryAnswerKey ? (
                <button type="button" disabled={saving} onClick={() => void choose(retryAnswerKey)} className="mt-2 underline disabled:cursor-wait disabled:opacity-70" aria-busy={saving}>
                  {saving ? "সংরক্ষণ হচ্ছে..." : "আবার চেষ্টা করুন"}
                </button>
              ) : null}
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}
