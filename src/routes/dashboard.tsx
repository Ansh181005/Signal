import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowLeft,
  Building2,
  CheckCircle2,
  ChevronDown,
  Compass,
  CopyPlus,
  Cpu,
  DollarSign,
  Download,
  FileText,
  Lightbulb,
  Radar,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { computeAnalysis, formatCurrency, type Project } from "@/lib/analysis";
import { getDemoProject, hasDemoSession } from "@/lib/demo-session";
import { exportAnalysisToPdf } from "@/lib/pdf-export";
import {
  getActiveSessionProject,
  subscribeSessionChange,
} from "@/lib/session-store";
import Aurora from "@/components/Aurora";
import { EnhancedSuggestionsView } from "@/components/EnhancedSuggestionsView";
import { ExecutiveDashboard } from "@/components/ExecutiveDashboard";
import { FeasibilityView } from "@/components/FeasibilityView";
import { MarketView } from "@/components/MarketView";
import { OverviewView } from "@/components/OverviewView";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Signal" },
      { name: "description", content: "Executive Risk & Assessment Dashboard" },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [tab, setTab] = useState<
    "dashboard" | "overview" | "competitors" | "risk" | "market" | "suggestions" | "swot" | "feasibility"
  >("dashboard");

  function loadActiveSession() {
    const activeLive = getActiveSessionProject();
    if (activeLive) {
      setProject(activeLive);
      return;
    }
    if (hasDemoSession()) {
      const demoP = getDemoProject("demo-project-1");
      if (demoP) setProject(demoP);
    }
  }

  useEffect(() => {
    loadActiveSession();
    return subscribeSessionChange(() => {
      loadActiveSession();
    });
  }, []);

  const analysis = useMemo(() => (project ? computeAnalysis(project) : null), [project]);

  if (!project || !analysis) {
    return (
      <div className="relative min-h-[calc(100vh-64px)] w-full overflow-hidden">
        <div className="fixed inset-0 z-0">
          <Aurora colorStops={["#F97316", "#ffc1ab", "#ff5d00"]} blend={0.67} amplitude={1.0} speed={1} />
          <div className="absolute inset-0 bg-background/50 backdrop-blur-[3px]" />
        </div>
        <main className="relative z-10 mx-auto max-w-4xl px-6 py-20 text-center">
          <div className="glass-card p-10 space-y-5 border border-white/10 rounded-3xl shadow-2xl">
            <div className="mx-auto h-16 w-16 rounded-2xl bg-[color:var(--accent)]/15 border border-[color:var(--accent)]/30 flex items-center justify-center text-[color:var(--accent)]">
              <FileText className="h-8 w-8" />
            </div>
            <h1 className="font-display text-2xl font-bold text-white">No Active Analysis Found</h1>
            <p className="text-sm text-[color:var(--muted-foreground)] max-w-md mx-auto">
              Please submit your startup details on the Project Input page to generate your Executive Dashboard and Risk Assessment.
            </p>
            <Link
              to="/project-input"
              className="inline-flex items-center gap-2 rounded-xl bg-[color:var(--accent)] px-6 py-3 text-sm font-semibold text-black hover:brightness-110 transition-all shadow-lg"
            >
              <Sparkles className="h-4 w-4" /> Go to Project Input
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const tabLabels: Record<string, string> = {
    dashboard: "Executive Dashboard",
    overview: "Overview",
    risk: "Risk Engine",
    swot: "SWOT Analysis",
    feasibility: "Feasibility",
    competitors: "Competitors",
    market: "Market",
    suggestions: "Suggestions",
  };

  return (
    <div className="relative min-h-[calc(100vh-64px)] w-full overflow-hidden">
      {/* Aurora Ambient Background */}
      <div className="fixed inset-0 z-0">
        <Aurora colorStops={["#F97316", "#ffc1ab", "#ff5d00"]} blend={0.67} amplitude={1.0} speed={1} />
        <div className="absolute inset-0 bg-background/50 backdrop-blur-[3px]" />
      </div>

      <main className="relative z-10 mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[color:var(--accent)] uppercase tracking-wider">
              <Sparkles className="h-3.5 w-3.5" /> Active Assessment Session
            </div>
            <h1 className="mt-1 font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              {project.name}
            </h1>
            <p className="mt-1 text-xs text-[color:var(--muted-foreground)]">
              {project.industry} &bull; {project.business_model || "Business Model"} &bull; Target: {project.target_market || "Market"}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => exportAnalysisToPdf(project, analysis)}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 px-5 py-2.5 text-xs font-bold text-white shadow-[0_0_25px_rgba(225,29,72,0.4)] hover:brightness-110 active:scale-95 transition-all border border-red-500/30 tracking-wide font-mono uppercase"
            >
              <Download className="h-4 w-4" />
              Download Report
            </button>
            <Link
              to="/project-input"
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/[0.06] px-4 py-2.5 text-xs font-semibold text-white hover:bg-white/15 transition-all backdrop-blur"
            >
              <ArrowLeft className="h-4 w-4 text-[color:var(--accent)]" />
              Edit Startup Details
            </Link>
          </div>
        </div>

        {/* Tab Navigation Pill Bar */}
        <div className="sm:hidden w-full glass-card p-1.5 border border-white/10 rounded-xl relative">
          <select
            value={tab}
            onChange={(e) => setTab(e.target.value as typeof tab)}
            className="w-full appearance-none rounded-lg bg-[color:var(--accent)]/15 border border-[color:var(--accent)]/30 px-3.5 py-2 text-xs font-semibold text-white focus:outline-none"
          >
            {Object.entries(tabLabels).map(([id, label]) => (
              <option key={id} value={id} className="bg-[color:var(--background-alt)] text-white">
                {label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-4 top-4 h-4 w-4 text-[color:var(--accent)]" />
        </div>

        <div className="hidden sm:flex gap-1 p-1 glass-card border border-white/10 rounded-xl overflow-x-auto scrollbar-none">
          {(["dashboard", "overview", "risk", "swot", "feasibility", "competitors", "market", "suggestions"] as const).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setTab(item)}
              className={`whitespace-nowrap shrink-0 rounded-lg px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-200 ${
                tab === item
                  ? "bg-[color:var(--accent)]/15 text-white border border-[color:var(--accent)]/40 shadow-[0_0_15px_rgba(245,158,11,0.25)] font-semibold"
                  : "text-[color:var(--muted-foreground)] hover:text-white hover:bg-white/5"
              }`}
            >
              {tabLabels[item]}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {tab === "dashboard" && (
          <ExecutiveDashboard analysis={analysis} project={project} onTabSelect={(t) => setTab(t as typeof tab)} />
        )}
        {tab === "overview" && <OverviewView analysis={analysis} project={project} />}
        {tab === "competitors" && <CompetitorsTab analysis={analysis} />}
        {tab === "risk" && <RisksTab analysis={analysis} />}
        {tab === "swot" && analysis.swot && <SwotTab swot={analysis.swot} />}
        {tab === "feasibility" && <FeasibilityView feasibility={analysis.feasibility} analysis={analysis} />}
        {tab === "market" && <MarketView project={project} analysis={analysis} />}
        {tab === "suggestions" && (
          <div className="mt-3">
            <EnhancedSuggestionsView analysis={analysis} project={project} />
          </div>
        )}
      </main>
    </div>
  );
}

function CompetitorsTab({ analysis }: { analysis: ReturnType<typeof computeAnalysis> }) {
  return (
    <div className="mt-3 grid gap-4 md:grid-cols-2">
      {analysis.competitors.map((item) => (
        <div key={item.name} className="glass-card p-5 border border-white/10 space-y-3 rounded-2xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <h3 className="font-display text-sm font-bold text-white">{item.name}</h3>
            <span className="font-mono text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[color:var(--accent)]/15 text-[color:var(--accent)] border border-[color:var(--accent)]/30">
              {item.overlap}% Overlap
            </span>
          </div>
          <p className="text-xs text-emerald-300">
            <strong className="uppercase text-[10px] text-emerald-400 block mb-0.5">Strength:</strong>
            {item.strength}
          </p>
          <p className="text-xs text-rose-300">
            <strong className="uppercase text-[10px] text-rose-400 block mb-0.5">Weakness:</strong>
            {item.weakness}
          </p>
        </div>
      ))}
    </div>
  );
}

function RisksTab({ analysis }: { analysis: ReturnType<typeof computeAnalysis> }) {
  return (
    <div className="mt-3 grid gap-4 md:grid-cols-2">
      {analysis.risks.map((r: any) => (
        <div key={r.category} className="glass-card p-5 border border-white/10 space-y-3 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="font-display text-xs font-bold text-white">{r.category} Risk</span>
              <span
                className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full border ${
                  r.score >= 70
                    ? "bg-red-500/20 text-red-300 border-red-500/30"
                    : r.score >= 45
                    ? "bg-amber-500/20 text-amber-300 border-amber-500/30"
                    : "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                }`}
              >
                Score: {r.score}/100
              </span>
            </div>
            <p className="mt-2 text-xs text-[color:var(--muted-foreground)] leading-relaxed">{r.note}</p>
          </div>
          {r.mitigation && (
            <div className="pt-2 border-t border-white/10 text-xs text-emerald-300 flex items-start gap-2">
              <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
              <span>
                <strong className="text-emerald-400">Action:</strong> {r.mitigation}
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function SwotTab({ swot }: { swot: NonNullable<ReturnType<typeof computeAnalysis>["swot"]> }) {
  const quads = [
    { title: "Strengths", items: swot.strengths, border: "border-emerald-500/30", bg: "bg-emerald-950/20", text: "text-emerald-300" },
    { title: "Weaknesses", items: swot.weaknesses, border: "border-rose-500/30", bg: "bg-rose-950/20", text: "text-rose-300" },
    { title: "Opportunities", items: swot.opportunities, border: "border-sky-500/30", bg: "bg-sky-950/20", text: "text-sky-300" },
    { title: "Threats", items: swot.threats, border: "border-amber-500/30", bg: "bg-amber-950/20", text: "text-amber-300" },
  ];
  return (
    <div className="mt-3 grid gap-4 grid-cols-1 md:grid-cols-2">
      {quads.map((q) => (
        <div key={q.title} className={`glass-card p-5 border ${q.border} ${q.bg} space-y-3 rounded-2xl`}>
          <h3 className={`font-display text-sm font-bold ${q.text}`}>{q.title}</h3>
          <ul className="space-y-2 text-xs text-slate-200">
            {q.items.map((it, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-white shrink-0" />
                <span>{it.text}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

