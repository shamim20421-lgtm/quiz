"use client";

import { Check } from "lucide-react";
import { BanglaNumberText } from "@/components/bangla-number-text";

export function AnswerOption({
  text,
  selected,
  disabled,
  onSelect,
}: {
  text: string;
  selected: boolean;
  disabled?: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onSelect}
      className="flex min-h-16 w-full items-center justify-between gap-3 rounded-2xl border border-rose-100 bg-white px-4 py-3 text-left text-base font-medium text-slate-900 transition hover:border-rose-300 hover:bg-rose-50 focus:outline focus:outline-2 focus:outline-rose-500 disabled:cursor-wait disabled:opacity-70"
      aria-pressed={selected}
    >
      <span>
        <BanglaNumberText text={text} />
      </span>
      {selected ? <Check aria-hidden="true" className="h-5 w-5 shrink-0 text-rose-600" /> : null}
    </button>
  );
}
