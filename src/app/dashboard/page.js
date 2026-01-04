import SidebarNav from "../../components/SidebarNav";

export default function DashboardPage() {
  return (
    <div className="min-h-screen w-full bg-white text-foreground">
      <div className="min-h-screen w-full bg-white">
        <div className="border-b border-zinc-300 bg-zinc-100 px-6 py-3 text-center">
          <div className="text-sm font-semibold tracking-wide text-zinc-700">
            Dashboard
          </div>
        </div>

        <div className="flex min-h-[calc(100vh-49px)]">
          <SidebarNav />

          <main className="flex-1 overflow-y-auto px-10 py-10">
            <div className="mx-auto max-w-5xl">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <section>
                  <h2 className="text-sm font-semibold text-zinc-900">
                    Today&apos;s Adventure - Mon Jan 05
                  </h2>
                  <div className="mt-2 rounded border border-zinc-400 bg-white p-4 text-sm text-zinc-800">
                    <ul className="space-y-2">
                      <li className="rounded border border-zinc-300 px-3 py-2">
                        [9:00-10:00 Study] Math Review
                      </li>
                      <li className="rounded border border-zinc-300 px-3 py-2">
                        [10:00-11:00 Study] Work on Essay
                      </li>
                      <li className="rounded border border-zinc-300 px-3 py-2">
                        [11:00-12:00 Study] Math Review
                      </li>
                    </ul>
                  </div>
                </section>

                <section>
                  <h2 className="text-sm font-semibold text-zinc-900">
                    Quick Check
                  </h2>
                  <div className="mt-2 rounded border border-zinc-400 bg-white p-4 text-sm text-zinc-800">
                    <p>
                      <span className="font-semibold">Mood:</span> Mostly Neutral
                    </p>
                    <p className="mt-2">
                      <span className="font-semibold">Balance:</span> A lot of
                      studying
                    </p>
                    <p className="mt-2">
                      <span className="font-semibold">Tip:</span> Free more time
                      for yourself
                    </p>
                  </div>
                </section>
              </div>

              <div className="mt-6">
                <div className="flex flex-wrap gap-2 border-b border-zinc-300 pb-2">
                  {[
                    "Study Planner",
                    "Breakdown wizard",
                    "Mood Tracker",
                    "Guided Notes",
                  ].map((label) => (
                    <button
                      key={label}
                      type="button"
                      className="rounded border border-zinc-400 bg-white px-3 py-2 text-xs font-medium text-zinc-800"
                    >
                      {label}
                    </button>
                  ))}
                </div>

                <div className="mt-4 rounded border border-zinc-400 bg-white p-10">
                  <div className="text-center text-lg font-semibold text-zinc-800">
                    [Tab Content Shown]
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
