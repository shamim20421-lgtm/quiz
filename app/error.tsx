"use client";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <div className="min-h-[calc(100svh-9rem)] px-4 py-8">
      <section className="mx-auto max-w-[520px] rounded-3xl bg-white p-6 text-center text-slate-900">
        <h1 className="text-2xl font-bold">দুঃখিত, কিছু সমস্যা হয়েছে</h1>
        <p className="mt-3 leading-7 text-slate-600">পাতাটি ঠিকভাবে দেখানো যায়নি। আবার চেষ্টা করুন।</p>
        <button type="button" onClick={reset} className="mt-6 min-h-12 rounded-full bg-rose-500 px-5 font-semibold text-white focus:outline focus:outline-2 focus:outline-rose-500">
          আবার চেষ্টা করুন
        </button>
      </section>
    </div>
  );
}
