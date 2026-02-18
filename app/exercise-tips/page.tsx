import TopBar from "../component/dashboard/TopBar";

export default function ExerciseTipsPage() {
  return (
    <div className="min-h-screen bg-black">
      <TopBar />
      <main className="px-5 py-12 text-white">
        <div className="mx-auto w-full max-w-2xl">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-black/30">
            <div className="mx-auto w-fit rounded-full bg-lime-400 px-6 py-2 text-center text-sm font-semibold text-black">
              Exercise Tips
            </div>

            <div className="mt-6 flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-wide text-slate-300">
              <span className="rounded-full border border-white/15 px-3 py-1">
                Fitness Goal
              </span>
              <span className="rounded-full border border-white/15 px-3 py-1">
                Strength
              </span>
              <span className="rounded-full border border-white/15 px-3 py-1">
                Training
              </span>
              <span className="rounded-full border border-white/15 px-3 py-1">
                Cardio
              </span>
            </div>

            <p className="mt-5 text-base font-semibold italic text-slate-200">
              According to this, you can plan your workout by knowing your goal
              and what else you can do.
            </p>

            <div className="mt-8 grid gap-4">
              <div className="rounded-xl border border-white/10 bg-black/40 p-4">
                <p className="text-sm font-semibold text-white">General Health</p>
                <p className="mt-1 text-sm text-slate-300">
                  2 days/week, 150 mins moderate activity
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-black/40 p-4">
                <p className="text-sm font-semibold text-white">Weight Loss</p>
                <p className="mt-1 text-sm text-slate-300">
                  3 days/week, mix of HIIT &amp; steady state
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-black/40 p-4">
                <p className="text-sm font-semibold text-white">Muscle Gain</p>
                <p className="mt-1 text-sm text-slate-300">
                  4–5 days/week, light activity (walking)
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
