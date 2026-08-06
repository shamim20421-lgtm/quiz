import Link from "next/link";
import { CheckCircle2, ShieldCheck } from "lucide-react";

const signs = [
  "আগে নিজে থেকে বার্তা পাঠাত, এখন পাঠায় না",
  "উত্তর আগের তুলনায় ছোট বা দেরিতে আসে",
  "দেখা করা বা কথা বলার পরিকল্পনা এড়িয়ে যায়",
  "কথোপকথনে আগ্রহ কম মনে হয়",
  "ভবিষ্যৎ নিয়ে কথা বলা কমে গেছে",
];

const receives = ["যোগাযোগের বর্তমান ধরন", "সম্ভাব্য কারণগুলো", "আজ কী করা উচিত", "একটি নমুনা বার্তা", "কোন ভুলগুলো এড়িয়ে চলবেন"];

const faqs = [
  ["এটি কি নিশ্চিতভাবে বলে দেবে সে কী ভাবছে?", "না। এটি আপনার উত্তরের ভিত্তিতে সম্পর্কের যোগাযোগের কিছু ইঙ্গিত সাজিয়ে দেখায়।"],
  ["আমার উত্তর কি ব্যক্তিগত থাকবে?", "এই MVP-তে আপনার উত্তর শুধু ফলাফল তৈরির জন্য ব্যবহার করা হয় এবং ব্যবহারকারী অ্যাকাউন্ট লাগে না।"],
  ["রিপোর্ট কি কাউন্সেলিংয়ের বিকল্প?", "না। এটি আত্ম-পর্যালোচনার সহায়ক উপকরণ, পেশাদার কাউন্সেলিং নয়।"],
  ["ডেমো পেমেন্টে কি টাকা কাটবে?", "না। Step 2 পরীক্ষার জন্য এটি কেবল ডেমো আনলক অভিজ্ঞতা।"],
];

export default function HomePage() {
  return (
    <div className="bg-[#071426]">
      <section className="mx-auto grid min-h-[calc(100svh-4rem)] max-w-[920px] content-center gap-8 px-4 py-10">
        <div className="max-w-[640px]">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-rose-200/30 px-3 py-2 text-sm text-rose-100">
            <ShieldCheck aria-hidden="true" className="h-4 w-4" />
            Relationship Check
          </div>
          <h1 className="text-4xl font-black leading-tight text-white sm:text-5xl">সে কি সত্যিই আপনার প্রতি আগ্রহ হারাচ্ছে?</h1>
          <p className="mt-5 text-lg leading-8 text-slate-200">
            আগের মতো কথা বলে না, সময় দেয় না বা উত্তর দিতে দেরি করে? এক মিনিটের কিছু প্রশ্নের উত্তর দিয়ে পরিস্থিতিটি আরও পরিষ্কারভাবে বুঝুন।
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link className="rounded-full bg-rose-500 px-6 py-4 text-center font-bold text-white transition hover:bg-rose-600 focus:outline focus:outline-2 focus:outline-rose-200" href="/start">
              এক মিনিটের যাচাই শুরু করুন
            </Link>
          </div>
          <p className="mt-4 text-sm leading-6 text-slate-300">আপনার উত্তর ব্যক্তিগত থাকবে। এটি কোনো নিশ্চিত ভবিষ্যদ্বাণী নয়।</p>
        </div>
      </section>

      <section className="bg-white px-4 py-12 text-slate-900">
        <div className="mx-auto max-w-[920px]">
          <h2 className="text-2xl font-black">এই পরিবর্তনগুলো কি লক্ষ্য করছেন?</h2>
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
            {["পরিস্থিতি নির্বাচন করুন", "দশটি প্রশ্নের উত্তর দিন", "ব্যক্তিগত ফলাফল দেখুন"].map((item, index) => (
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
