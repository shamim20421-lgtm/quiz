"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle2, Copy, LockKeyhole } from "lucide-react";
import { ButtonSpinner } from "@/components/button-spinner";
import { trackEvent } from "@/lib/analytics";
import { useSessionState } from "@/lib/session-context";

type PaymentStatus = "pending" | "verified" | "rejected";

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

const defaultOffer = {
  bkashNumber: "01953121121",
  amount: 199,
  regularAmount: 399,
  currency: "BDT" as const,
};

export default function PaymentPage() {
  const router = useRouter();
  const { sessionToken } = useSessionState();
  const [offer, setOffer] = useState(defaultOffer);
  const [payment, setPayment] = useState<Payment | null>(null);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState("");
  const [copyStatus, setCopyStatus] = useState("");
  const submittingRef = useRef(false);
  const trackedView = useRef(false);
  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!sessionToken) {
      router.replace("/start");
      return;
    }

    async function loadPaymentStatus() {
      setPageLoading(true);
      setError("");
      try {
        const response = await fetch(`/api/payment/status?sessionToken=${encodeURIComponent(sessionToken!)}`);
        const payload = (await response.json()) as PaymentStatusResponse;
        if (!response.ok) throw new Error(payload.error);
        setOffer(payload.offer);
        setPayment(payload.payment);
      } catch {
        setError("পেমেন্ট তথ্য আনা যায়নি। আবার চেষ্টা করুন।");
      } finally {
        setPageLoading(false);
      }
    }

    void loadPaymentStatus();
  }, [router, sessionToken]);

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
      if (payload.status === "verified") router.push("/report");
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
              পেমেন্ট ভেরিফাই হয়েছে
            </div>
            <Link href="/report" className="mt-4 block min-h-14 rounded-full bg-rose-500 px-5 py-4 text-center font-semibold text-white hover:bg-rose-600 focus:outline focus:outline-2 focus:outline-rose-500">
              বিস্তারিত রিপোর্ট দেখুন
            </Link>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-6 grid gap-4">
            {isPending ? (
              <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4 font-semibold text-amber-800">
                Payment verification pending
                <p className="mt-2 text-sm font-normal leading-6">আপনার TrxID জমা হয়েছে। ম্যানুয়ালি যাচাই করার পর বিস্তারিত রিপোর্ট আনলক হবে।</p>
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
