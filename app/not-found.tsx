import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="min-h-[calc(100svh-9rem)] px-4 py-8">
      <section className="mx-auto max-w-[520px] rounded-3xl bg-white p-6 text-center text-slate-900">
        <h1 className="text-2xl font-bold">পাতাটি পাওয়া যায়নি</h1>
        <p className="mt-3 leading-7 text-slate-600">ঠিকানাটি ভুল হতে পারে অথবা পাতাটি সরানো হয়েছে।</p>
        <Link href="/" className="mt-6 inline-block min-h-12 rounded-full bg-rose-500 px-5 py-3 font-semibold text-white focus:outline focus:outline-2 focus:outline-rose-500">
          প্রথম পাতায় যান
        </Link>
      </section>
    </div>
  );
}
