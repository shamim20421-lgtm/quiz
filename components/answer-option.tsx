"use client";

import { Check } from "lucide-react";
import { BanglaNumberText } from "@/components/bangla-number-text";

export function AnswerOption({
  text,
  selected,
  disabled,
  loading,
  onSelect,
}: {
  text: string;
  selected: boolean;
  disabled?: boolean;
  loading?: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      role="radio"
      disabled={disabled}
      onClick={onSelect}
      className={`flex min-h-16 w-full items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-left text-base font-medium text-slate-900 transition duration-150 ease-out hover:-translate-y-px hover:border-rose-300 hover:bg-rose-50 focus:outline focus:outline-2 focus:outline-rose-500 disabled:cursor-wait disabled:opacity-70 motion-reduce:hover:translate-y-0 motion-reduce:transition-none ${selected ? "scale-[0.995] border-rose-400 bg-rose-50" : "border-rose-100 bg-white"}`}
      aria-checked={selected}
      aria-busy={loading}
    >
      <span>
        <BanglaNumberText text={text} />
      </span>
      {selected ? <Check aria-hidden="true" className="h-5 w-5 shrink-0 text-rose-600" /> : null}
    </button>
  );
}
