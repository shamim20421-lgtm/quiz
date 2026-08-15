export function ProgressBar({ value, max }: { value: number; max: number }) {
  const width = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div aria-label="অগ্রগতি" className="h-2 overflow-hidden rounded-full bg-slate-200">
      <div className="h-full rounded-full bg-rose-500 transition-[width] duration-[350ms] ease-out motion-reduce:transition-none" style={{ width: `${width}%` }} />
    </div>
  );
}
