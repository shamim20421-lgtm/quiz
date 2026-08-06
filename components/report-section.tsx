export function ReportSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-rose-100 bg-white p-5 text-slate-900 shadow-sm">
      <h2 className="text-lg font-bold">{title}</h2>
      <div className="mt-3 text-base leading-7 text-slate-700">{children}</div>
    </section>
  );
}
