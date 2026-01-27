export default function ProductRow({ title }: { title: string }) {
  const items = Array.from({ length: 12 });

  return (
    <section className="mx-auto max-w-6xl px-4 py-8">
      {/* <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-700">{title}</h2>
        <button className="text-sm text-slate-600 hover:underline">See more</button>
      </div> */}

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {items.map((_, i) => (
          <div key={i} className="rounded-2xl border bg-white p-3">
            {/* Red square image placeholder */}
            <div className="aspect-square w-full rounded-xl bg-red-500/80" />

            {/* Dummy text placeholders */}
            <div className="mt-3 space-y-2">
              <div className="h-3 w-24 rounded bg-slate-200" />
              <div className="h-3 w-16 rounded bg-slate-200" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
