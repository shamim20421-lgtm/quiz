import { Loader2 } from "lucide-react";

export function LoadingState({ title, text }: { title: string; text?: string }) {
  return (
    <div role="status" className="flex flex-col items-center justify-center gap-4 rounded-3xl bg-white p-8 text-center text-slate-900">
      <Loader2 aria-hidden="true" className="h-8 w-8 animate-spin text-rose-600" />
      <div>
        <p className="text-lg font-semibold">{title}</p>
        {text ? <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p> : null}
      </div>
    </div>
  );
}
