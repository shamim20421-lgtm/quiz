"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useSessionState } from "@/lib/session-context";
import type { Tone } from "@/lib/types";

const tones: { label: string; value: Tone }[] = [
  { label: "কোমল", value: "soft" },
  { label: "পরিণত", value: "mature" },
  { label: "রোমান্টিক", value: "romantic" },
  { label: "আত্মবিশ্বাসী", value: "confident" },
];

export default function MessagePage() {
  const router = useRouter();
  const { sessionToken } = useSessionState();
  const [tone, setTone] = useState<Tone>("soft");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/message/generate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          sessionToken: sessionToken ?? undefined,
          receivedText: form.get("receivedText"),
          intention: form.get("intention"),
          tone,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      sessionStorage.setItem("messageResult", JSON.stringify(data));
      router.push("/message/result");
    } catch {
      setError("বার্তা তৈরি করা যায়নি। আবার চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[calc(100svh-9rem)] px-4 py-8">
      <form onSubmit={submit} className="mx-auto max-w-[520px] rounded-3xl bg-white p-6 text-slate-900">
        <h1 className="text-3xl font-black">বাংলা বার্তা তৈরি করুন</h1>
        <p className="mt-3 leading-7 text-slate-600">পরিস্থিতিটি লিখুন—আপনার জন্য তিনটি ভিন্ন ভঙ্গির সম্মানজনক বার্তা তৈরি হবে।</p>
        <div className="mt-6 grid gap-5">
          <label className="grid gap-2 font-semibold">
            সে কী লিখেছে?
            <textarea name="receivedText" required maxLength={1000} rows={5} className="rounded-2xl border border-slate-300 p-4 leading-7 focus:outline focus:outline-2 focus:outline-rose-500" />
          </label>
          <label className="grid gap-2 font-semibold">
            আপনি কী বলতে চান?
            <textarea name="intention" required maxLength={1000} rows={5} className="rounded-2xl border border-slate-300 p-4 leading-7 focus:outline focus:outline-2 focus:outline-rose-500" />
          </label>
          <fieldset>
            <legend className="font-semibold">বার্তার ভঙ্গি বেছে নিন</legend>
            <div className="mt-3 grid grid-cols-2 gap-3">
              {tones.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setTone(item.value)}
                  aria-pressed={tone === item.value}
                  className={`min-h-12 rounded-2xl border px-4 font-bold focus:outline focus:outline-2 focus:outline-rose-500 ${tone === item.value ? "border-rose-500 bg-rose-50 text-rose-700" : "border-slate-300 text-slate-800"}`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </fieldset>
        </div>
        <p aria-live="polite" className="mt-4 min-h-6 text-sm font-semibold text-rose-700">{error}</p>
        <button disabled={loading} className="mt-3 min-h-14 w-full rounded-full bg-rose-500 px-5 font-bold text-white hover:bg-rose-600 focus:outline focus:outline-2 focus:outline-rose-500 disabled:opacity-70">
          {loading ? "তৈরি হচ্ছে..." : "তিনটি বার্তা তৈরি করুন"}
        </button>
      </form>
    </div>
  );
}
