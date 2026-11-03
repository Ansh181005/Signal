import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, TrendingUp, Target, ShieldCheck } from "lucide-react";
import Aurora from "@/components/Aurora";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Signal" },
      {
        name: "description",
        content: "Review a project and get a clear view of market, competitor, and execution risk.",
      },
      {
        property: "og:title",
        content: "Signal",
      },
      {
        property: "og:description",
        content: "Review a project and get a clear view of market, competitor, and execution risk.",
      },
    ],
  }),
  component: Index,
});

const features = [
  {
    icon: TrendingUp,
    title: "Revenue projections",
    body: "Rule-based forecasts calibrated against your budget, sector, and target market.",
  },
  {
    icon: Target,
    title: "Competitor radar",
    body: "See who you're up against, where they're strong, and where the seams are open.",
  },
  {
    icon: ShieldCheck,
    title: "Risk analysis",
    body: "Signals across market, execution, and capital risk — surfaced before you burn runway.",
  },
];

function Index() {
  return (
    <main className="relative min-h-[calc(100vh-65px)] w-full flex flex-col">
      {/* Interactive Background */}
      <div className="fixed inset-0 z-0">
        <Aurora
          colorStops={["#F97316","#ffc1ab","#ff5d00"]}
          blend={0.67}
          amplitude={1.0}
          speed={1}
        />
        {/* Subtle overlay to ensure text readability */}
        <div className="absolute inset-0 bg-background/40 backdrop-blur-[2px]" />
      </div>

      {/* Main Content */}
      <section className="relative z-10 mx-auto max-w-5xl w-full px-6 py-12 md:px-10 md:py-20 lg:py-24 text-center flex flex-col items-center">
        {/* Hero Top Section */}
        <div className="flex flex-col items-center">
          {/* Prominent Hero Logo */}
          <div className="relative mb-4 flex items-center justify-center">
            <div className="absolute inset-0 -z-10 rounded-full bg-amber-500/15 blur-2xl scale-125" />
            <img
              src="/smart-logo-white.png"
              alt="Signal Logo"
              className="h-24 w-24 sm:h-28 sm:w-28 md:h-32 md:w-32 object-contain drop-shadow-[0_0_25px_rgba(245,158,11,0.35)] transition-transform duration-300 hover:scale-105 select-none pointer-events-none"
            />
          </div>

          <h1 className="max-w-4xl font-display text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight leading-tight">
            A quiet room for <span className="italic text-[color:var(--foreground)]">loud ideas.</span>
          </h1>
          <p className="mt-4 max-w-2xl text-sm sm:text-base text-[color:var(--muted-foreground)] font-sans font-normal leading-relaxed">
            Quantify market friction, competitor overlap, and execution risk before you commit capital. A purely analytical workspace for founders.
          </p>
          <div className="mt-6 sm:mt-8 flex flex-wrap justify-center gap-3.5">
            <Link
              to="/project-input"
              className="group inline-flex items-center gap-2 rounded-full bg-[color:var(--foreground)] px-7 py-3 text-sm font-semibold text-[color:var(--background)] transition-all duration-200 hover:scale-105 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)]"
            >
              Evaluate a startup
              <ArrowRight
                className="h-4 w-4 transition-transform group-hover:translate-x-1"
                strokeWidth={2}
              />
            </Link>
            <Link
              to="/project-input"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-transparent px-7 py-3 text-sm font-medium text-[color:var(--foreground)] transition-colors hover:bg-white/5 active:scale-[0.98]"
            >
              See how it works
            </Link>
          </div>
        </div>

        {/* Feature Columns Bottom Row */}
        <div className="mt-14 sm:mt-16 md:mt-20 w-full grid gap-0 md:grid-cols-3 text-left">
          {features.map((f) => (
            <div
              key={f.title}
              className="p-4 sm:p-5 md:p-6 transition-all duration-300 border-l border-white/10 last:border-r last:border-white/10 hover:border-white/30"
            >
              <f.icon className="h-5 w-5 text-[color:var(--foreground)] opacity-75" strokeWidth={1.5} />
              <h3 className="mt-3 font-display text-base sm:text-lg font-medium tracking-wide text-[color:var(--foreground)]">
                {f.title}
              </h3>
              <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-[color:var(--muted-foreground)]">
                {f.body}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
