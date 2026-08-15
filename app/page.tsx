import Link from "next/link";
import Image from "next/image";
import { CheckCircle2, LockKeyhole, ShieldCheck, Sparkles } from "lucide-react";

const signs = [
  "আগে নিজে থেকে মেসেজ করত...",
  "এখন শুধু “ঠিক আছে” লিখে।",
  "দেখা করার কথা বলে না।",
  "রিপ্লাই দিতে অনেক সময় নেয়।",
  "আপনি না লিখলে আর কথা হয় না।",
];

const receives = ["আজ কী করবেন", "কী লিখবেন", "কী লিখবেন না", "আগামী ৩ দিনের পরিকল্পনা", "কথা শুরু করার নিরাপদ উপায়"];

const faqs = [
  ["এটি কি নিশ্চিতভাবে বলে দেবে সে কী ভাবছে?", "না। এটি আপনার উত্তরের ভিত্তিতে সম্পর্কের যোগাযোগের কিছু ইঙ্গিত সাজিয়ে দেখায়।"],
  ["আমার উত্তর কি ব্যক্তিগত থাকবে?", "এই MVP-তে আপনার উত্তর শুধু ফলাফল তৈরির জন্য ব্যবহার করা হয় এবং ব্যবহারকারী অ্যাকাউন্ট লাগে না।"],
  ["এই সহায়ক কি কাউন্সেলিংয়ের বিকল্প?", "না। এটি আত্ম-পর্যালোচনার সহায়ক উপকরণ, পেশাদার কাউন্সেলিং নয়।"],
  ["ডেমো পেমেন্টে কি টাকা কাটবে?", "না। Step 2 পরীক্ষার জন্য এটি কেবল ডেমো আনলক অভিজ্ঞতা।"],
];

export default function HomePage() {
  return (
    <div className="bg-[#071426]">
      <section className="mx-auto grid min-h-[calc(100svh-4rem)] max-w-[920px] content-center gap-8 px-4 py-8 lg:grid-cols-[1fr_360px] lg:items-center">
        <div className="max-w-[640px]">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-rose-200/30 px-3 py-2 text-sm text-rose-100">
            <ShieldCheck aria-hidden="true" className="h-4 w-4" />
            সম্পর্ক সহায়ক
          </div>
          <h1 className="text-4xl font-black leading-tight text-white sm:text-5xl">আজও কি তার রিপ্লাইয়ের অপেক্ষায় আছেন?</h1>
          <p className="mt-4 text-xl font-semibold leading-8 text-rose-100">অনুমান নয়। মাত্র ১ মিনিটে বুঝুন এখন কী করা সবচেয়ে ভালো।</p>
          <p className="mt-4 text-lg leading-8 text-slate-200">আপনার পরিস্থিতির ভিত্তিতে যোগাযোগের পরবর্তী পদক্ষেপ, কী লিখবেন এবং কী এড়িয়ে চলবেন—সব এক জায়গায় দেখুন।</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link className="rounded-full bg-rose-500 px-6 py-4 text-center font-bold text-white transition hover:bg-rose-600 focus:outline focus:outline-2 focus:outline-rose-200" href="/start">
              ❤️ এখন কী করব জানুন
            </Link>
          </div>
          <p className="mt-4 flex items-center gap-2 text-sm leading-6 text-slate-300">
            <LockKeyhole aria-hidden="true" className="h-4 w-4 text-rose-200" />
            আপনার উত্তর সম্পূর্ণ ব্যক্তিগত থাকবে।
          </p>
        </div>
        <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-2 shadow-sm">
          <Image
            src="/images/empty-chat-rain.png"
            alt="বৃষ্টির রাতে ফাঁকা চ্যাটসহ একটি ফোনের শান্ত নীল ইলাস্ট্রেশন"
            width={720}
            height={720}
            priority
            className="aspect-square w-full rounded-[1.5rem] object-cover"
          />
        </div>
      </section>

      <section className="bg-white px-4 py-12 text-slate-900">
        <div className="mx-auto max-w-[920px]">
          <h2 className="text-2xl font-black">আপনার কি এমন হচ্ছে?</h2>
          <div className="mt-6 grid gap-3">
            {signs.map((item) => (
              <div key={item} className="flex items-start gap-3 rounded-2xl border border-rose-100 p-4">
                <CheckCircle2 aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-rose-600" />
                <p className="leading-7">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#0d1d33] px-4 py-12">
        <div className="mx-auto max-w-[920px]">
          <h2 className="text-2xl font-black text-white">আপনার ভরসার জায়গা</h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {[
              ["আপনার তথ্য ব্যক্তিগত থাকবে।", LockKeyhole],
              ["AI আপনার উত্তর বিশ্লেষণ করবে।", Sparkles],
              ["কোনো উত্তর অন্য কারও সঙ্গে শেয়ার করা হবে না।", ShieldCheck],
            ].map(([text, Icon]) => (
              <div key={String(text)} className="rounded-2xl border border-white/10 bg-white p-5 text-slate-900">
                <Icon aria-hidden="true" className="h-6 w-6 text-rose-600" />
                <p className="mt-4 font-semibold leading-7">{String(text)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-12">
        <div className="mx-auto max-w-[920px]">
          <h2 className="text-2xl font-black text-white">আপনি যা পাবেন</h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {receives.map((item) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-slate-100">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#0d1d33] px-4 py-12">
        <div className="mx-auto max-w-[920px]">
          <h2 className="text-2xl font-black text-white">কীভাবে কাজ করে</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {["আজ কী হয়েছে বলুন", "দশটি প্রশ্নের উত্তর দিন", "আপনার করণীয় দেখুন"].map((item, index) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-white p-5 text-slate-900">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-rose-100 font-bold text-rose-700">{index + 1}</div>
                <p className="mt-4 font-semibold">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-12 text-slate-900">
        <div className="mx-auto max-w-[920px]">
          <h2 className="text-2xl font-black">সাধারণ প্রশ্ন</h2>
          <div className="mt-6 space-y-4">
            {faqs.map(([question, answer]) => (
              <details key={question} className="rounded-2xl border border-rose-100 p-4">
                <summary className="cursor-pointer font-bold">{question}</summary>
                <p className="mt-3 leading-7 text-slate-600">{answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
