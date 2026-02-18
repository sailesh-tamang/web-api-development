import TopBar from "../component/dashboard/TopBar";

export default function MealPlanPage() {
  return (
    <div className="min-h-screen bg-black">
      <TopBar />
      <main className="px-5 py-12 text-white">
        <div className="mx-auto w-full max-w-2xl">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-black/30">
            <div className="mx-auto w-fit rounded-full bg-lime-400 px-6 py-2 text-center text-sm font-semibold text-black">
              Meal Plan
            </div>

            <div className="mt-6 flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-wide text-slate-300">
              <span className="rounded-full border border-white/15 px-3 py-1">
                Nutrition
              </span>
              <span className="rounded-full border border-white/15 px-3 py-1">
                Balance
              </span>
              <span className="rounded-full border border-white/15 px-3 py-1">
                Hydration
              </span>
              <span className="rounded-full border border-white/15 px-3 py-1">
                Recovery
              </span>
            </div>

            <p className="mt-5 text-base font-semibold italic text-slate-200">
              Build a plan that fuels your day: steady energy, clean ingredients,
              and consistent habits that support your fitness goal.
            </p>

            <div className="mt-8 grid gap-4">
              <div className="rounded-xl border border-white/10 bg-black/40 p-4">
                <p className="text-sm font-semibold text-white">Weight Loss</p>
                <p className="mt-1 text-sm text-slate-300">
                  High protein, lower sugar, and portion control
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-black/40 p-4">
                <p className="text-sm font-semibold text-white">Maintenance</p>
                <p className="mt-1 text-sm text-slate-300">
                  Balanced calories with whole foods
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-black/40 p-4">
                <p className="text-sm font-semibold text-white">Muscle Gain</p>
                <p className="mt-1 text-sm text-slate-300">
                  Calorie surplus with protein each meal
                </p>
              </div>
            </div>

            <div className="mt-8">
              <details className="group rounded-xl border border-lime-300 bg-lime-400 p-4 text-black">
                <summary className="cursor-pointer list-none text-sm font-semibold">
                  <span className="inline-flex items-center gap-2">
                    Suggestion For Body
                    <span className="text-xs text-black/70 group-open:rotate-180">
                      ▼
                    </span>
                  </span>
                </summary>
                <div className="mt-3 flex flex-wrap gap-3">
                  <button className="rounded-full bg-black px-4 py-2 text-sm font-semibold text-lime-300">
                    Weight Gain
                  </button>
                  <button className="rounded-full bg-black px-4 py-2 text-sm font-semibold text-lime-300">
                    Weight Loss
                  </button>
                </div>
              </details>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
