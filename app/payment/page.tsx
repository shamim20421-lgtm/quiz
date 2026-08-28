"use client";

import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle2, Copy, LockKeyhole } from "lucide-react";
import { BanglaNumberText } from "@/components/bangla-number-text";
import { ButtonSpinner } from "@/components/button-spinner";
import { LoadingState } from "@/components/loading-state";
import { ReportSection } from "@/components/report-section";
import { trackEvent } from "@/lib/analytics";
import { useSessionState } from "@/lib/session-context";

type PaymentStatus = "pending" | "verified" | "rejected";

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

type Payment = {
  id: string;
  amount: number;
  currency: "BDT";
  status: PaymentStatus;
  created_at: string;
  verified_at?: string | null;
};

type PaymentStatusResponse = {
  payment: Payment | null;
  offer: {
    bkashNumber: string;
    amount: number;
    regularAmount: number;
    currency: "BDT";
  };
  error?: string;
};

type PaymentSubmitResponse = {
  success?: boolean;
  payment?: Payment;
  status?: PaymentStatus;
  error?: string;
};

type QuizResponse = {
  report?: Report;
  error?: string;
};

const defaultOffer = {
  bkashNumber: "01953121121",
  amount: 199,
  regularAmount: 399,
  currency: "BDT" as const,
};

const pollingIntervalMs = 4500;
const pollingTimeoutMs = 20 * 60 * 1000;

export default function PaymentPage() {
  const router = useRouter();
  const { sessionToken, isSessionLoaded } = useSessionState();
  const [offer, setOffer] = useState(defaultOffer);
  const [payment, setPayment] = useState<Payment | null>(null);
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState("");
  const [copyStatus, setCopyStatus] = useState("");
  const [pollingTimedOut, setPollingTimedOut] = useState(false);
  const submittingRef = useRef(false);
  const trackedView = useRef(false);
  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const loadUnlockedReport = useCallback(async () => {
    if (!sessionToken) return null;

    const response = await fetch(`/api/quiz/${sessionToken}`, { cache: "no-store" });
    const payload = (await response.json()) as QuizResponse;
    if (!response.ok || !payload.report?.is_unlocked) return null;
    setReport(payload.report);
    return payload.report;
  }, [sessionToken]);

  const loadPaymentStatus = useCallback(async ({ showLoading = false }: { showLoading?: boolean } = {}) => {
    if (!sessionToken) return null;
    if (showLoading) setPageLoading(true);
    setError("");
    try {
      const response = await fetch(`/api/payment/status?sessionToken=${encodeURIComponent(sessionToken)}`, { cache: "no-store" });
      const payload = (await response.json()) as PaymentStatusResponse;
      if (!response.ok) throw new Error(payload.error);
      setOffer(payload.offer);
      setPayment(payload.payment);
      if (payload.payment?.status === "verified") await loadUnlockedReport();
      return payload.payment;
    } catch {
      setError("পেমেন্ট তথ্য আনা যায়নি। আবার চেষ্টা করুন।");
      return null;
    } finally {
      if (showLoading) setPageLoading(false);
    }
  }, [loadUnlockedReport, sessionToken]);

  useEffect(() => {
    if (!isSessionLoaded) return;
    if (!sessionToken) {
      router.replace("/start");
      return;
    }

    void loadPaymentStatus({ showLoading: true });
  }, [isSessionLoaded, loadPaymentStatus, router, sessionToken]);

  useEffect(() => {
    if (trackedView.current) return;
    trackedView.current = true;
    trackEvent("payment_page_viewed");
  }, []);

  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (!sessionToken || payment?.status !== "pending" || report) return;

    let stopped = false;
    const startedAt = Date.now();
    setPollingTimedOut(false);

    const poll = async () => {
      if (stopped) return;
      if (Date.now() - startedAt > pollingTimeoutMs) {
        setPollingTimedOut(true);
        return;
      }

      const latestPayment = await loadPaymentStatus();
      if (!latestPayment || stopped) return;

      if (latestPayment.status === "verified") {
        stopped = true;
        await loadUnlockedReport();
        return;
      }

      if (latestPayment.status === "rejected") {
        stopped = true;
      }
    };

    const interval = setInterval(() => {
      void poll();
    }, pollingIntervalMs);

    return () => {
      stopped = true;
      clearInterval(interval);
    };
  }, [loadPaymentStatus, loadUnlockedReport, payment?.status, report, sessionToken]);

  useEffect(() => {
    if (payment?.status !== "verified" || report) return;
    void loadUnlockedReport();
  }, [loadUnlockedReport, payment?.status, report]);

  async function copyNumber() {
    try {
      await navigator.clipboard.writeText(offer.bkashNumber);
      setCopyStatus("নম্বর কপি হয়েছে");
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
      copyTimeoutRef.current = setTimeout(() => setCopyStatus(""), 2000);
    } catch {
      setCopyStatus("কপি করা যায়নি");
    }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading || submittingRef.current) return;
    if (!sessionToken) {
      router.push("/start");
      return;
    }

    submittingRef.current = true;
    setLoading(true);
    setError("");
    const form = new FormData(event.currentTarget);

    try {
      const response = await fetch("/api/payment/submit", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          sessionToken,
          bkashTrxId: form.get("bkashTrxId"),
          senderMobileNumber: form.get("senderMobileNumber"),
        }),
      });
      const payload = (await response.json()) as PaymentSubmitResponse;
      if (!response.ok) throw new Error(payload.error);
      if (payload.payment) setPayment(payload.payment);
      if (payload.status === "verified") await loadUnlockedReport();
      trackEvent("manual_payment_submitted");
    } catch (error) {
      setError(error instanceof Error && error.message ? error.message : "পেমেন্ট তথ্য সংরক্ষণ করা যায়নি। আবার চেষ্টা করুন।");
    } finally {
      submittingRef.current = false;
      setLoading(false);
    }
  }

  const isPending = payment?.status === "pending";
  const isVerified = payment?.status === "verified";
  const isRejected = payment?.status === "rejected";

  if (!isSessionLoaded || (pageLoading && !payment && !error)) {
    return <div className="mx-auto max-w-[520px] px-4 py-8"><LoadingState title="পেমেন্ট তথ্য আনা হচ্ছে..." /></div>;
  }

  if (report && isVerified) {
    return (
      <div className="px-4 py-8">
        <div className="mx-auto grid max-w-[520px] gap-4">
          <section className="rounded-3xl border border-green-100 bg-green-50 p-5 text-green-700 shadow-sm">
            <div className="flex items-center gap-2 text-lg font-bold">
              <CheckCircle2 aria-hidden="true" className="h-6 w-6" />
              পেমেন্ট সফলভাবে যাচাই হয়েছে ✓
            </div>
          </section>
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
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100svh-9rem)] px-4 py-8">
      <section className="mx-auto max-w-[520px] rounded-3xl bg-white p-6 text-slate-900">
        <LockKeyhole aria-hidden="true" className="h-8 w-8 text-rose-600" />
        <h1 className="mt-4 text-3xl font-bold leading-tight">সম্পূর্ণ Relationship Analysis আনলক করুন</h1>
        <p className="mt-3 rounded-2xl bg-rose-50 p-4 font-semibold text-rose-700">🎉 প্রথম ৫০ জনের জন্য ৫০% Launch Discount</p>

        <div className="mt-5 flex items-end gap-3">
          <p className="text-2xl font-bold text-slate-400 line-through">৳{offer.regularAmount}</p>
          <p className="text-5xl font-bold text-rose-700">৳{offer.amount}</p>
        </div>

        <div className="mt-6 rounded-2xl border border-rose-100 p-4">
          <h2 className="font-bold">bKash-এ Send Money করুন</h2>
          <div className="mt-4 grid gap-3 text-slate-700">
            <div>
              <p className="text-sm font-semibold text-slate-500">Number</p>
              <div className="mt-1 flex items-center justify-between gap-3 rounded-2xl bg-slate-50 px-4 py-3">
                <span className="font-bold">{offer.bkashNumber}</span>
                <button type="button" onClick={() => void copyNumber()} className="inline-flex h-10 w-10 items-center justify-center rounded-full text-rose-700 hover:bg-rose-50 focus:outline focus:outline-2 focus:outline-rose-500" aria-label="bKash নম্বর কপি করুন">
                  <Copy aria-hidden="true" className="h-5 w-5" />
                </button>
              </div>
              <p aria-live="polite" className="mt-1 min-h-5 text-sm font-semibold text-rose-700">{copyStatus}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500">Amount</p>
              <p className="mt-1 rounded-2xl bg-slate-50 px-4 py-3 text-xl font-bold">৳{offer.amount}</p>
            </div>
          </div>
        </div>

        {isVerified ? (
          <div className="mt-6 rounded-2xl border border-green-100 bg-green-50 p-4 text-green-700">
            <div className="flex items-center gap-2 font-bold">
              <CheckCircle2 aria-hidden="true" className="h-5 w-5" />
              পেমেন্ট সফলভাবে যাচাই হয়েছে ✓
            </div>
            <p className="mt-2 text-sm font-semibold">রিপোর্ট আনা হচ্ছে...</p>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-6 grid gap-4">
            {isPending ? (
              <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4 font-semibold text-amber-800">
                পেমেন্ট যাচাই করা হচ্ছে...
                <p className="mt-2 text-sm font-normal leading-6">সাধারণত কয়েক মিনিটের মধ্যেই যাচাই সম্পন্ন হবে। এই পেজটি বন্ধ করবেন না।</p>
                {pollingTimedOut ? <p className="mt-2 text-sm font-semibold">যাচাই শেষ হতে একটু বেশি সময় লাগছে। পরে এই পেজটি আবার খুললে বর্তমান অবস্থা দেখা যাবে।</p> : null}
              </div>
            ) : null}
            {isRejected ? (
              <div className="rounded-2xl border border-rose-100 bg-rose-50 p-4 font-semibold text-rose-700">
                পেমেন্ট তথ্য মেলেনি। সঠিক TrxID দিয়ে আবার জমা দিন।
              </div>
            ) : null}
            <label className="grid gap-2 font-semibold">
              bKash Transaction ID (TrxID)
              <input name="bkashTrxId" required disabled={isPending || pageLoading} className="min-h-12 rounded-2xl border border-slate-300 px-4 uppercase focus:outline focus:outline-2 focus:outline-rose-500 disabled:bg-slate-100" />
            </label>
            <label className="grid gap-2 font-semibold">
              যে নম্বর থেকে Send Money করেছেন
              <input name="senderMobileNumber" required disabled={isPending || pageLoading} className="min-h-12 rounded-2xl border border-slate-300 px-4 focus:outline focus:outline-2 focus:outline-rose-500 disabled:bg-slate-100" />
              <span className="text-sm font-normal leading-6 text-slate-500">শুধু ম্যানুয়াল bKash যাচাইয়ের জন্য ব্যবহার হবে।</span>
            </label>
            <p aria-live="polite" className="min-h-6 text-sm font-semibold text-rose-700">{error}</p>
            <button disabled={loading || isPending || pageLoading} className="inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-full bg-rose-500 px-5 font-semibold text-white hover:bg-rose-600 focus:outline focus:outline-2 focus:outline-rose-500 disabled:cursor-wait disabled:opacity-70" aria-busy={loading}>
              {loading ? (
                <>
                  <ButtonSpinner />
                  জমা হচ্ছে...
                </>
              ) : isPending ? (
                "যাচাইয়ের অপেক্ষায় আছে"
              ) : (
                "পেমেন্ট তথ্য জমা দিন"
              )}
            </button>
          </form>
        )}
      </section>
    </div>
  );
}
