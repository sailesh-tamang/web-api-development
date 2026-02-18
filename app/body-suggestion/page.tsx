import TopBar from "../component/dashboard/TopBar";

export default function BodySuggestionPage() {
  return (
    <div className="min-h-screen bg-black">
      <TopBar />
      <main className="px-5 py-10 text-white">
        <div className="mx-auto w-full max-w-md">
          <div className="rounded-md bg-lime-400 px-4 py-2 text-center text-base font-semibold text-black">
            Body Suggestion
          </div>

          <p className="mt-6 text-sm text-slate-200">
            Focus on consistency: combine strength training, daily movement, and
            balanced meals for sustainable progress.
          </p>
          <div className="mt-6 space-y-4 text-sm font-semibold text-slate-100">
            <p>Build strength: 3–4 days/week of resistance training.</p>
            <p>Stay active: 7–10k steps or 30 mins walking daily.</p>
            <p>Recover well: 7–8 hours sleep and proper hydration.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
