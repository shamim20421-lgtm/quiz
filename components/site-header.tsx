import Link from "next/link";
import { HeartHandshake } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-[#071426]/95 backdrop-blur">
      <div className="mx-auto flex min-h-16 w-full max-w-[920px] items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 rounded-md font-semibold text-white focus:outline focus:outline-2 focus:outline-rose-300">
          <HeartHandshake aria-hidden="true" className="h-5 w-5 text-rose-300" />
          <span>আজকের সম্পর্ক</span>
        </Link>
        <Link
          href="/start"
          className="rounded-full bg-rose-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-600 focus:outline focus:outline-2 focus:outline-rose-200"
        >
          শুরু করুন
        </Link>
      </div>
    </header>
  );
}
