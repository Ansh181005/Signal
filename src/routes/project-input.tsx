import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  AlertTriangle,
  ArrowRight,
  BookmarkCheck,
  Building2,
  CheckCircle2,
  ChevronDown,
  Compass,
  Cpu,
  Dice5,
  DollarSign,
  FileText,
  Globe,
  Lightbulb,
  Loader2,
  Radar,
  RotateCcw,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import {
  CURRENCY_MAP,
  CurrencyCode,
  computeAnalysis,
  computeRuleBasedAnalysis,
  formatCurrency,
  generateStartupSuggestions,
  getRandomDemoProject,
  type Project,
} from "@/lib/analysis";
import { hasDemoSession, saveDemoProject } from "@/lib/demo-session";
import { analyzeProject, createProject, getCurrentUser } from "@/lib/local-api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Aurora from "@/components/Aurora";
import { EnhancedSuggestionsView } from "@/components/EnhancedSuggestionsView";
import { FeasibilityView } from "@/components/FeasibilityView";
import { MarketView } from "@/components/MarketView";
import { OverviewView } from "@/components/OverviewView";
import {
  getActiveSessionProject,
  setActiveSessionProject,
  subscribeSessionChange,
} from "@/lib/session-store";

export const Route = createFileRoute("/project-input")({
  validateSearch: (search: Record<string, unknown>): Partial<{
    name: string;
    industry: string;
    business_model: string;
    target_market: string;
    budget: number;
    description: string;
  }> => {
    return {
      name: (search.name as string) || undefined,
      industry: (search.industry as string) || undefined,
      business_model: (search.business_model as string) || undefined,
      target_market: (search.target_market as string) || undefined,
      budget: search.budget !== undefined ? Number(search.budget) : undefined,
      description: (search.description as string) || undefined,
    };
  },
  head: () => ({
    meta: [
      { title: "Project Input — Signal" },
      {
        name: "description",
        content:
          "Submit your startup details for an instant market, competitor, and risk analysis.",
      },
      { property: "og:title", content: "Project Input — Signal" },
      {
        property: "og:description",
        content:
          "Submit your startup details for an instant market, competitor, and risk analysis.",
      },
    ],
  }),
  component: ProjectInputPage,
});

const INDUSTRIES = [
  "SaaS",
  "Fintech",
  "Healthtech",
  "Edtech",
  "E-commerce",
  "AI",
  "Marketplace",
  "Consumer",
  "Hardware",
  "Cybersecurity",
  "Other",
];

const MODELS = [
  "B2B Subscription",
  "B2C Subscription",
  "Usage-based",
  "Marketplace",
  "Freemium",
  "Enterprise licensing",
  "Transactional",
  "Ads",
];

type FormState = Project;

const empty: FormState = {
  name: "",
  industry: "",
  business_model: "",
  target_market: "",
  budget: 0,
  currency: "USD",
  description: "",
};


function ProjectInputPage() {
  const searchParams = Route.useSearch();
  const [form, setForm] = useState<FormState>({
    ...empty,
    name: searchParams.name || "",
    industry: searchParams.industry || "",
    business_model: searchParams.business_model || "",
    target_market: searchParams.target_market || "",
    budget: searchParams.budget || 0,
    description: searchParams.description || "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [runningAnalysis, setRunningAnalysis] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState<Project | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const navigate = useNavigate();
  const [tab, setTab] = useState<"overview" | "competitors" | "risk" | "market" | "suggestions" | "swot" | "feasibility">("overview");
  const [mobileView, setMobileView] = useState<"form" | "analysis">("form");

  const [liveAnalysis, setLiveAnalysis] = useState<any>(null);
  const [analyzedForm, setAnalyzedForm] = useState<FormState | null>(null);
  const [isAiSearching, setIsAiSearching] = useState(false);
  const [isFormDirty, setIsFormDirty] = useState(false);

  useEffect(() => {
    getCurrentUser().then(({ user }) => setCurrentUser(user));
    const active = getActiveSessionProject();
    if (active && !form.name) {
      setForm(active);
      setLiveAnalysis(active.analysis_data || computeAnalysis(active));
      setAnalyzedForm(active);
    }
  }, []);

  const rawAnalysis = saved?.analysis_data || liveAnalysis;
  const activeAnalysis = useMemo(() => (rawAnalysis ? computeAnalysis(rawAnalysis) : null), [rawAnalysis]);
  const activeProjectName = saved?.name || analyzedForm?.name || form.name.trim() || "Live Analysis";

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    const nextForm = { ...form, [key]: value };
    setForm(nextForm);
    setIsFormDirty(true);
    if (rawAnalysis) {
      setActiveSessionProject({ ...nextForm, analysis_data: rawAnalysis });
    }
  }

  function fillDemo() {
    const demo = getRandomDemoProject();
    setForm(demo);
    setIsFormDirty(true);
    setError(null);
    if (rawAnalysis) {
      setActiveSessionProject({ ...demo, analysis_data: rawAnalysis });
    }
  }

  function resetForm() {
    setForm(empty);
    setError(null);
    setSaved(null);
    setLiveAnalysis(null);
    setAnalyzedForm(null);
    setIsFormDirty(false);
    setMobileView("form");
  }

  async function handleRunAnalysis(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!form.name.trim() || !form.industry.trim() || !form.description.trim()) {
      setError("Please complete name, industry, and description.");
      return;
    }
    if (form.budget < 0 || Number.isNaN(form.budget)) {
      setError("Budget must be a positive number.");
      return;
    }

    setRunningAnalysis(true);
    setIsAiSearching(true);
    let finalRes = null;
    try {
      const { analysis: aiResult } = await analyzeProject(form);
      if (aiResult) {
        finalRes = aiResult;
      }
    } catch (err) {
      console.warn("AI analysis network issue, using local computation:", err);
      finalRes = computeAnalysis(form);
    } finally {
      if (!finalRes) finalRes = computeAnalysis(form);
      setLiveAnalysis(finalRes);
      setAnalyzedForm(form);
      setIsFormDirty(false);
      setMobileView("analysis");
      setRunningAnalysis(false);
      setIsAiSearching(false);
      setActiveSessionProject({ ...form, analysis_data: finalRes });
    }
  }

  async function handleSaveAnalysis(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!currentUser) {
      setError("Sign in to save this analysis to your account database.");
      return;
    }
    if (!activeAnalysis) {
      setError("Run an analysis first before saving.");
      return;
    }
    if (!form.name.trim() || !form.industry.trim() || !form.description.trim()) {
      setError("Please complete name, industry, and description.");
      return;
    }

    setSubmitting(true);
    try {
      const { project } = await createProject({
        name: form.name.trim(),
        industry: form.industry.trim(),
        business_model: form.business_model.trim(),
        target_market: form.target_market.trim(),
        budget: form.budget,
        currency: form.currency || "USD",
        description: form.description.trim(),
      });
      setSubmitting(false);
      setSaved(project || { ...form, analysis_data: activeAnalysis });
    } catch (error) {
      setSubmitting(false);
      setError(error instanceof Error ? error.message : "Unable to save analysis to database.");
    }
  }


  return (
    <div className="relative min-h-[calc(100vh-64px)] w-full overflow-hidden">
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

      <main className="relative z-10 mx-auto max-w-[95%] px-3.5 py-4 sm:px-6 md:px-10 md:py-6">
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <h1 className="mt-1 font-display text-2xl font-semibold tracking-tight sm:text-3xl md:text-4xl">
          Startup Submission
        </h1>

        {/* Mobile View Toggle Pills (Only on mobile when analysis is active) */}
        {activeAnalysis && (
          <div className="flex lg:hidden p-1 glass-card rounded-xl">
            <button
              type="button"
              onClick={() => setMobileView("form")}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all ${
                mobileView === "form"
                  ? "bg-white/10 text-white shadow-sm"
                  : "text-[color:var(--muted-foreground)] hover:text-white"
              }`}
            >
              <FileText className="h-3.5 w-3.5" />
              Startup Details
            </button>
            <button
              type="button"
              onClick={() => setMobileView("analysis")}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all ${
                mobileView === "analysis"
                  ? "bg-[color:var(--accent)]/20 text-[color:var(--accent)] border border-[color:var(--accent)]/30 shadow-sm"
                  : "text-[color:var(--muted-foreground)] hover:text-white"
              }`}
            >
              <Sparkles className="h-3.5 w-3.5 text-[color:var(--accent)]" />
              Analysis Results
            </button>
          </div>
        )}
      </div>

      <div className="grid gap-5 lg:gap-6 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)] items-stretch">
        {/* FORM */}
        <form
          onSubmit={handleRunAnalysis}
          className={`glass-card p-4 sm:p-6 md:p-7 flex-col justify-between h-full ${
            activeAnalysis && mobileView === "analysis" ? "hidden lg:flex" : "flex"
          }`}
        >
          <div>
            <div className="flex items-center justify-between gap-2 border-b border-white/5 pb-3 sm:pb-4">
              <h2 className="font-display text-base sm:text-xl font-semibold">Startup Details</h2>
              <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                <button
                  type="button"
                  onClick={fillDemo}
                  className="inline-flex items-center gap-1 sm:gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-2 sm:px-2.5 py-1 sm:py-1.5 text-[11px] sm:text-xs font-medium text-[color:var(--foreground)] transition-all duration-200 hover:border-white/25 hover:bg-white/5 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)]"
                >
                  <Dice5 className="h-3 w-3 sm:h-3.5 sm:w-3.5" strokeWidth={1.75} />
                  Fill demo
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="inline-flex items-center gap-1 sm:gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-2 sm:px-2.5 py-1 sm:py-1.5 text-[11px] sm:text-xs font-medium text-[color:var(--muted-foreground)] transition-all duration-200 hover:border-white/25 hover:bg-white/5 hover:text-[color:var(--foreground)] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)]"
                >
                  <RotateCcw className="h-3 w-3 sm:h-3.5 sm:w-3.5" strokeWidth={1.75} />
                  Reset
                </button>
              </div>
            </div>

            <div className="mt-4 sm:mt-5 space-y-3 sm:space-y-4">
              <Field
                label="Startup / Project name"
                icon={<Building2 className="h-3.5 w-3.5" strokeWidth={1.5} />}
              >
                <input
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  placeholder="Ember Analytics"
                  className={inputCls}
                />
              </Field>

              <div className="grid grid-cols-2 gap-2.5 sm:gap-3.5">
                <Field label="Industry" icon={<Radar className="h-3.5 w-3.5" strokeWidth={1.5} />}>
                  <Select value={form.industry} onValueChange={(val) => update("industry", val)}>
                    <SelectTrigger className={inputCls}>
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent className="border border-white/10 bg-[#12121a] text-[color:var(--foreground)] z-50">
                      {INDUSTRIES.map((i) => (
                        <SelectItem key={i} value={i} className="hover:bg-white/10 cursor-pointer text-xs sm:text-sm">
                          {i}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
                <Field
                  label="Business model"
                  icon={<Target className="h-3.5 w-3.5" strokeWidth={1.5} />}
                >
                  <Select value={form.business_model} onValueChange={(val) => update("business_model", val)}>
                    <SelectTrigger className={inputCls}>
                      <SelectValue placeholder="Select model" />
                    </SelectTrigger>
                    <SelectContent className="border border-white/10 bg-[#12121a] text-[color:var(--foreground)] z-50">
                      {MODELS.map((i) => (
                        <SelectItem key={i} value={i} className="hover:bg-white/10 cursor-pointer text-xs sm:text-sm">
                          {i}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              </div>

              <Field label="Target market" icon={<Users className="h-3.5 w-3.5" strokeWidth={1.5} />}>
                <input
                  value={form.target_market}
                  onChange={(e) => update("target_market", e.target.value)}
                  placeholder="Mid-market RevOps teams in North America"
                  className={inputCls}
                />
              </Field>

              <Field
                label="Budget & Currency"
                icon={<DollarSign className="h-3.5 w-3.5" strokeWidth={1.5} />}
              >
                <div className="grid grid-cols-[1fr_auto] gap-2">
                  <input
                    type="number"
                    min={0}
                    value={form.budget || ""}
                    onChange={(e) => update("budget", Number(e.target.value))}
                    placeholder="120000"
                    className={inputCls}
                  />
                  <Select
                    value={form.currency || "USD"}
                    onValueChange={(val) => update("currency", val as CurrencyCode)}
                  >
                    <SelectTrigger className="w-24 sm:w-28 rounded-lg border border-white/10 bg-[color:var(--card-solid)]/60 px-2.5 sm:px-3 py-2.5 text-xs sm:text-sm text-[color:var(--foreground)] backdrop-blur">
                      <SelectValue placeholder="Currency" />
                    </SelectTrigger>
                    <SelectContent className="border border-white/10 bg-[#12121a] text-[color:var(--foreground)] z-50">
                      {Object.entries(CURRENCY_MAP).map(([code, meta]) => (
                        <SelectItem key={code} value={code} className="hover:bg-white/10 cursor-pointer text-xs sm:text-sm">
                          {meta.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </Field>

              <Field
                label="Project description"
                icon={<FileText className="h-3.5 w-3.5" strokeWidth={1.5} />}
              >
                <textarea
                  value={form.description}
                  onChange={(e) => update("description", e.target.value)}
                  placeholder="Describe the product, the wedge, and why now…"
                  rows={3}
                  className={`${inputCls} resize-none`}
                />
              </Field>
            </div>
          </div>

          <div className="mt-5 sm:mt-6 pt-3.5 sm:pt-4 border-t border-white/5 flex flex-col gap-2 sm:gap-2.5">
            {error && (
              <div className="mb-2 flex items-start gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300">
                <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" strokeWidth={1.75} />
                {error}
              </div>
            )}

            {activeAnalysis && !isFormDirty ? (
              <button
                type="button"
                onClick={() => navigate({ to: "/dashboard" })}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-500 px-4 sm:px-6 py-2.5 sm:py-3 text-sm font-bold text-black transition-all duration-200 hover:bg-emerald-400 hover:shadow-[0_0_25px_rgba(16,185,129,0.45)] active:scale-[0.98]"
              >
                <Sparkles className="h-4 w-4" /> View Dashboard →
              </button>
            ) : (
              <button
                type="button"
                onClick={handleRunAnalysis}
                disabled={runningAnalysis || isAiSearching}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[color:var(--accent)] px-4 sm:px-6 py-2.5 sm:py-3 text-sm font-semibold text-[color:var(--accent-foreground)] transition-all duration-200 hover:brightness-110 hover:shadow-[0_0_28px_rgba(245,158,11,0.45)] active:scale-[0.98] disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)]"
              >
                {runningAnalysis || isAiSearching ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Analyzing market data…
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" /> Run analysis
                  </>
                )}
              </button>
            )}

            {activeAnalysis && (
              <button
                type="button"
                onClick={() => setMobileView("analysis")}
                className="flex lg:hidden w-full items-center justify-center gap-2 rounded-lg border border-[color:var(--accent)]/30 bg-[color:var(--accent)]/10 px-4 py-2 text-xs font-semibold text-[color:var(--accent)]"
              >
                View Analysis Results →
              </button>
            )}

            <button
              type="button"
              onClick={handleSaveAnalysis}
              disabled={submitting || !currentUser || !activeAnalysis}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-white/15 bg-white/[0.04] px-4 sm:px-6 py-2.5 text-sm font-medium text-[color:var(--foreground)] transition-all duration-200 hover:border-white/30 hover:bg-white/10 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)]"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Saving to database…
                </>
              ) : (
                <>
                  <BookmarkCheck className="h-4 w-4 text-emerald-400" /> Save analysis
                </>
              )}
            </button>

            {!currentUser ? (
              <p className="text-center text-[11px] text-[color:var(--muted-foreground)]">
                🔒 Sign in to save analyses to your workspace
              </p>
            ) : !activeAnalysis ? (
              <p className="text-center text-[11px] text-[color:var(--muted-foreground)]">
                ⚡ Run an analysis first to enable saving
              </p>
            ) : saved ? (
              <div className="flex items-center justify-center gap-2 text-xs text-emerald-300/90">
                <CheckCircle2 className="h-3.5 w-3.5" strokeWidth={1.75} />
                Analysis saved to database
              </div>
            ) : null}
          </div>
        </form>


        {/* ANALYSIS */}
        <section
          className={`flex-col h-full gap-4 ${
            activeAnalysis && mobileView === "form" ? "hidden lg:flex" : "flex"
          }`}
        >
          {isAiSearching ? (
            <CreativeAiRadarLoader projectName={activeProjectName} industry={form.industry || saved?.industry || ""} />
          ) : !activeAnalysis ? (
            <EmptyAnalysis />
          ) : (
            <div className="flex flex-col h-full gap-3 sm:gap-4">
              <header className="glass-card p-3.5 sm:px-5 sm:py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 w-full min-w-0 overflow-hidden">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 min-w-0">
                  <h2 className="font-display text-base sm:text-xl font-semibold tracking-tight truncate">{activeProjectName}</h2>
                  <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-2 sm:px-2.5 py-0.5 text-[10px] sm:text-[11px] font-medium text-amber-300 shrink-0">
                    <Sparkles className="h-3 w-3 text-amber-400 shrink-0" />
                    <span>Live Market Research Active</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigate({ to: "/dashboard" })}
                    className="inline-flex items-center gap-1 rounded-full border border-emerald-500/40 bg-emerald-500/15 px-2.5 py-0.5 text-[10px] sm:text-[11px] font-semibold text-emerald-300 hover:bg-emerald-500/25 transition-all shrink-0"
                  >
                    <span>View Executive Dashboard →</span>
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center sm:text-left sm:flex sm:items-center sm:gap-5 border-t sm:border-t-0 border-white/10 pt-2.5 sm:pt-0 w-full sm:w-auto shrink-0">
                  <Stat label="Growth" value={`${activeAnalysis.growth}%`} accent />
                  <Stat label="Risk" value={`${activeAnalysis.overallRisk}/100`} />
                  <Stat
                    label="Budget"
                    value={formatCurrency(
                      saved?.budget || analyzedForm?.budget || 0,
                      saved?.currency || analyzedForm?.currency || "USD"
                    )}
                  />
                </div>
              </header>

              {/* Mobile Dropdown Select (Visible on Phone < 640px) */}
              <div className="sm:hidden w-full glass-card p-1.5 border border-white/10 rounded-xl relative">
                <div className="relative flex items-center">
                  <select
                    value={tab}
                    onChange={(e) => setTab(e.target.value as typeof tab)}
                    className="w-full appearance-none rounded-lg bg-[color:var(--accent)]/15 border border-[color:var(--accent)]/30 px-3.5 py-2.5 pr-10 text-xs font-semibold text-white focus:outline-none focus:ring-2 focus:ring-[color:var(--accent)]"
                  >
                    {[
                      { id: "overview", label: "Overview" },
                      { id: "risk", label: "Risk Engine" },
                      { id: "swot", label: "SWOT Analysis" },
                      { id: "feasibility", label: "Feasibility" },
                      { id: "competitors", label: "Competitors" },
                      { id: "market", label: "Market" },
                      { id: "suggestions", label: "Suggestions" },
                    ].map((t) => (
                      <option key={t.id} value={t.id} className="bg-[color:var(--background-alt)] text-white">
                        {t.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 h-4 w-4 text-[color:var(--accent)]" />
                </div>
              </div>

              {/* Desktop Pill Tab Bar (Visible on Screens >= 640px) */}
              <div className="hidden sm:flex gap-1 p-1 glass-card border border-white/10 rounded-xl overflow-x-auto scrollbar-none">
                {(
                  [
                    { id: "overview", label: "Overview" },
                    { id: "risk", label: "Risk Engine" },
                    { id: "swot", label: "SWOT Analysis" },
                    { id: "feasibility", label: "Feasibility" },
                    { id: "competitors", label: "Competitors" },
                    { id: "market", label: "Market" },
                    { id: "suggestions", label: "Suggestions" },
                  ] as const
                ).map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTab(t.id as typeof tab)}
                    className={`whitespace-nowrap shrink-0 rounded-lg px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-200 ${
                      tab === t.id
                        ? "bg-[color:var(--accent)]/15 text-white border border-[color:var(--accent)]/40 shadow-[0_0_15px_rgba(245,158,11,0.25)] font-semibold"
                        : "text-[color:var(--muted-foreground)] hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {tab === "overview" && (
                <OverviewView analysis={activeAnalysis} project={saved || analyzedForm || form} />
              )}

              {tab === "competitors" && (
                <div className="glass-card p-3.5 sm:p-6 flex-1 flex flex-col justify-between w-full min-w-0 overflow-hidden">
                  <div>
                    <h3 className="font-display text-base sm:text-lg font-semibold truncate">Competitor Landscape</h3>
                    <p className="mt-1 text-xs text-[color:var(--muted-foreground)]">
                      Estimated market positioning against{" "}
                      <span className="text-[color:var(--foreground)] font-medium">
                        {form.industry || saved?.industry || "the sector"}
                      </span>{" "}
                      incumbents.
                    </p>
                    <div className="mt-4 sm:mt-5 divide-y divide-white/5 w-full min-w-0">
                      {activeAnalysis.competitors.map((c: any) => (
                        <div
                          key={c.name}
                          className="grid gap-3 py-3 md:grid-cols-[1fr_2fr_auto] md:items-center w-full min-w-0"
                        >
                          <div className="min-w-0">
                            <p className="font-display font-semibold text-sm truncate">{c.name}</p>
                            <p className="mt-0.5 text-xs text-[color:var(--muted-foreground)]">
                              {c.marketShare}% market · {c.overlap}% overlap
                            </p>
                          </div>
                          <div className="grid gap-2 text-xs sm:grid-cols-2 min-w-0 w-full">
                            <div className="min-w-0">
                              <p className="text-[11px] font-medium text-emerald-400">
                                Strength
                              </p>
                              <p className="text-[color:var(--foreground)]/90 break-words leading-relaxed">{c.strength}</p>
                            </div>
                            <div className="min-w-0">
                              <p className="text-[11px] font-medium text-red-400">
                                Weakness
                              </p>
                              <p className="text-[color:var(--foreground)]/90 break-words leading-relaxed">{c.weakness}</p>
                            </div>
                          </div>
                          <div className="h-2 w-full md:w-28 overflow-hidden rounded-full bg-white/5 shrink-0">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-[color:var(--accent)] to-amber-300"
                              style={{ width: `${c.overlap}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {tab === "risk" && (
                <EnhancedRiskEngineView risks={activeAnalysis.risks} overallRisk={activeAnalysis.overallRisk} />
              )}

              {tab === "swot" && activeAnalysis.swot && (
                <SwotView swot={activeAnalysis.swot} />
              )}

              {tab === "feasibility" && (
                <FeasibilityView feasibility={activeAnalysis.feasibility} analysis={activeAnalysis} />
              )}

              {tab === "market" && (
                <MarketView project={saved || analyzedForm || form} analysis={activeAnalysis} />
              )}

              {tab === "suggestions" && (
                <EnhancedSuggestionsView analysis={activeAnalysis} project={analyzedForm || form} />
              )}
            </div>
          )}
        </section>
      </div>
    </main>
    </div>
  );
}

const inputCls =
  "w-full rounded-lg border border-white/10 bg-[color:var(--card-solid)]/60 px-3.5 py-2.5 text-sm text-[color:var(--foreground)] placeholder:text-[color:var(--muted-foreground)] backdrop-blur transition-all focus:border-[color:var(--accent)]/50 focus:outline-none focus:ring-2 focus:ring-[color:var(--accent)]/20 focus:shadow-[0_0_20px_rgba(245,158,11,0.12)]";

function Field({
  label,
  icon,
  children,
}: {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-center gap-1.5 font-sans text-xs font-medium text-[color:var(--foreground)]/80">
        <span className="text-[color:var(--accent)]">{icon}</span>
        {label}
      </span>
      {children}
    </label>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="min-w-0">
      <p className="font-sans text-[10px] sm:text-[11px] font-medium text-[color:var(--muted-foreground)] uppercase tracking-wider truncate">
        {label}
      </p>
      <p
        className={`mt-0.5 font-display text-xs sm:text-base font-semibold truncate ${accent ? "text-[color:var(--accent)]" : "text-[color:var(--foreground)]"
          }`}
      >
        {value}
      </p>
    </div>
  );
}

function ChartCard({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  children: React.ReactNode;
}) {
  return (
    <div className="glass-card p-3.5 sm:p-5 flex flex-col justify-between w-full min-w-0 overflow-hidden">
      <div className="mb-3 flex items-center gap-2 min-w-0">
        <Icon className="h-4 w-4 text-[color:var(--accent)] shrink-0" strokeWidth={1.5} />
        <h3 className="font-display text-sm font-semibold tracking-wide text-[color:var(--foreground)] truncate">
          {title}
        </h3>
      </div>
      <div className="flex-1 w-full min-w-0 overflow-hidden">{children}</div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-white/5 pb-2 last:border-0">
      <dt className="font-sans text-xs font-medium text-[color:var(--muted-foreground)]">
        {label}
      </dt>
      <dd className="max-w-[60%] text-right font-medium text-[color:var(--foreground)]/90">{value}</dd>
    </div>
  );
}

function EmptyAnalysis() {
  return (
    <div className="glass-card flex min-h-[520px] flex-col items-center justify-center gap-4 p-12 text-center">
      <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-[color:var(--accent)]/10 ring-1 ring-[color:var(--accent)]/30">
        <Radar className="h-7 w-7 text-[color:var(--accent)]" strokeWidth={1.5} />
        <span className="absolute inset-0 rounded-2xl shadow-[0_0_40px_rgba(245,158,11,0.3)]" />
      </div>
      <h3 className="font-display text-xl font-semibold">Awaiting your project</h3>
      <p className="max-w-md text-sm text-[color:var(--muted-foreground)]">
        Complete the form on the left and hit{" "}
        <span className="text-[color:var(--foreground)]">Run analysis</span>. Your revenue
        projection, competitor map, and risk breakdown appear here.
      </p>
    </div>
  );
}

const tooltipStyle: React.CSSProperties = {
  background: "rgba(18, 18, 26, 0.95)",
  border: "1px solid rgba(255, 255, 255, 0.15)",
  borderRadius: 8,
  fontSize: 12,
  color: "#FFFFFF",
  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5)",
};

const tooltipItemStyle: React.CSSProperties = {
  color: "#FFFFFF",
  fontSize: 12,
};

const tooltipLabelStyle: React.CSSProperties = {
  color: "#F59E0B",
  fontWeight: 600,
  fontSize: 12,
  marginBottom: 4,
};


function CreativeAiRadarLoader({ projectName, industry }: { projectName: string; industry: string }) {
  const [stepIndex, setStepIndex] = useState(0);

  const steps = [
    "Connecting to AI Live Search Grid…",
    `Scanning online competitor signals for ${industry || "the sector"}…`,
    "Evaluating market density & revenue trajectory…",
    "Analyzing capital runway & execution risk vectors…",
    "Synthesizing competitive advantage & market segments…",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setStepIndex((prev) => (prev + 1) % steps.length);
    }, 1200);
    return () => clearInterval(interval);
  }, [steps.length]);

  return (
    <div className="glass-card relative overflow-hidden p-10 text-center flex flex-col items-center justify-center min-h-[500px]">
      {/* Background ambient glow orbs */}
      <div className="ambient-orb -top-12 -left-12 h-64 w-64 bg-amber-500/20" />
      <div className="ambient-orb -bottom-12 -right-12 h-64 w-64 bg-amber-600/15" />

      {/* Radar scanning graphic */}
      <div className="relative flex h-48 w-48 items-center justify-center">
        {/* Pulsing Concentric Rings */}
        <div className="absolute inset-0 rounded-full border border-amber-500/20 animate-pulse-ring" />
        <div className="absolute inset-4 rounded-full border border-amber-500/30" />
        <div className="absolute inset-10 rounded-full border border-amber-500/40" />

        {/* Rotating Radar Beam */}
        <div className="absolute inset-0 rounded-full animate-radar opacity-60 bg-[conic-gradient(from_0deg,transparent_0deg_280deg,rgba(245,158,11,0.5)_360deg)]" />

        {/* Orbiting Icons */}
        <div className="absolute -top-2 right-4 animate-float text-amber-400/80">
          <Globe className="h-5 w-5" />
        </div>
        <div className="absolute bottom-2 left-3 animate-float text-amber-300/80" style={{ animationDelay: "1s" }}>
          <Cpu className="h-5 w-5" />
        </div>
        <div className="absolute top-10 left-1 animate-float text-amber-400/90" style={{ animationDelay: "2s" }}>
          <Search className="h-5 w-5" />
        </div>

        {/* Center AI Core */}
        <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/15 border border-amber-500/40 shadow-[0_0_30px_rgba(245,158,11,0.35)] backdrop-blur">
          <Sparkles className="h-8 w-8 text-amber-400 animate-pulse" />
        </div>
      </div>

      {/* Title & Live Status */}
      <div className="mt-8 space-y-2">
        <h3 className="font-display text-xl font-semibold tracking-tight text-[color:var(--foreground)]">
          AI Online Intelligence Research
        </h3>
        <p className="font-mono text-xs uppercase tracking-widest text-[color:var(--accent)]">
          Searching market data for {projectName || "your submission"}
        </p>
      </div>

      {/* Live Telemetry Step Message */}
      <div className="mt-6 flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-xs font-medium text-amber-200 backdrop-blur transition-all duration-300">
        <Loader2 className="h-3.5 w-3.5 animate-spin text-amber-400" />
        <span className="animate-pulse">{steps[stepIndex]}</span>
      </div>

      {/* Signal Bar */}
      <div className="mt-8 h-1.5 w-48 overflow-hidden rounded-full bg-white/5">
        <div className="h-full rounded-full bg-gradient-to-r from-amber-500 via-amber-300 to-amber-500 animate-pulse" style={{ width: "70%" }} />
      </div>
    </div>
  );
}

function SwotView({ swot }: { swot: NonNullable<import("@/lib/analysis").AnalysisResult["swot"]> }) {
  const quadrants = [
    {
      title: "Strengths",
      subtitle: "Internal Competitive Advantages",
      items: swot.strengths,
      accent: "text-emerald-400",
      badgeCls: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
      bgCls: "bg-emerald-950/10 border-emerald-500/20",
      icon: CheckCircle2,
    },
    {
      title: "Weaknesses",
      subtitle: "Internal Resource Constraints",
      items: swot.weaknesses,
      accent: "text-rose-400",
      badgeCls: "bg-rose-500/15 text-rose-300 border-rose-500/30",
      bgCls: "bg-rose-950/10 border-rose-500/20",
      icon: AlertTriangle,
    },
    {
      title: "Opportunities",
      subtitle: "External Market Growth Vectors",
      items: swot.opportunities,
      accent: "text-sky-400",
      badgeCls: "bg-sky-500/15 text-sky-300 border-sky-500/30",
      bgCls: "bg-sky-950/10 border-sky-500/20",
      icon: Sparkles,
    },
    {
      title: "Threats",
      subtitle: "External Market & Rival Headwinds",
      items: swot.threats,
      accent: "text-amber-400",
      badgeCls: "bg-amber-500/15 text-amber-300 border-amber-500/30",
      bgCls: "bg-amber-950/10 border-amber-500/20",
      icon: Target,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 flex-1 w-full min-w-0 overflow-hidden">
      {quadrants.map((q) => {
        const Icon = q.icon;
        return (
          <div key={q.title} className={`glass-card p-3.5 sm:p-5 border ${q.bgCls} flex flex-col justify-between w-full min-w-0 overflow-hidden`}>
            <div>
              <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-2.5 sm:pb-3">
                <div className="flex items-center gap-2 min-w-0">
                  <Icon className={`h-4 w-4 sm:h-5 sm:w-5 shrink-0 ${q.accent}`} />
                  <div className="min-w-0">
                    <h3 className="font-display text-sm sm:text-base font-semibold tracking-tight text-[color:var(--foreground)] truncate">{q.title}</h3>
                    <p className="text-[10px] sm:text-[11px] text-[color:var(--muted-foreground)] truncate">{q.subtitle}</p>
                  </div>
                </div>
                <span className={`shrink-0 text-[9px] sm:text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full border ${q.badgeCls}`}>
                  {q.items.length} Points
                </span>
              </div>
              <ul className="mt-3 sm:mt-4 space-y-2 sm:space-y-2.5">
                {q.items.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-[color:var(--foreground)]/90 leading-relaxed min-w-0 w-full">
                    <span className={`mt-1.5 h-1.5 w-1.5 rounded-full shrink-0 ${q.accent.replace("text-", "bg-")}`} />
                    <div className="flex-1 min-w-0 break-words">
                      <span className="break-words">{item.text}</span>
                      {item.category && (
                        <span className="ml-1.5 inline-block text-[10px] font-mono uppercase text-[color:var(--muted-foreground)] opacity-75">
                          • {item.category}
                        </span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );
      })}
    </div>
  );
}



function EnhancedRiskEngineView({ risks, overallRisk }: { risks: import("@/lib/analysis").RiskFactor[]; overallRisk: number }) {
  return (
    <div className="space-y-3 flex-1 w-full min-w-0 overflow-hidden">
      <div className="glass-card p-3 sm:p-4 border border-white/10 flex flex-row items-center justify-between gap-3 w-full min-w-0">
        <div>
          <h3 className="font-display text-sm sm:text-base font-semibold tracking-tight">Risk Engine Assessment</h3>
          <p className="text-[10px] sm:text-[11px] text-[color:var(--muted-foreground)]">
            Quantitative vulnerability matrix measuring 6 structural risk drivers.
          </p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-[9px] font-mono uppercase text-[color:var(--muted-foreground)]">Risk Index</p>
          <p className={`font-display text-base sm:text-lg font-bold ${overallRisk > 65 ? "text-red-400" : overallRisk > 45 ? "text-amber-400" : "text-emerald-400"}`}>
            {overallRisk}/100
          </p>
        </div>
      </div>

      <div className="grid gap-2.5 grid-cols-1 sm:grid-cols-2 w-full min-w-0">
        {risks.map((r: any) => {
          const sev = r.severity || (r.score >= 75 ? "critical" : r.score >= 55 ? "high" : r.score >= 35 ? "medium" : "low");
          const sevBadge =
            sev === "critical"
              ? "bg-red-500/20 text-red-300 border-red-500/35"
              : sev === "high"
              ? "bg-amber-500/20 text-amber-300 border-amber-500/35"
              : sev === "medium"
              ? "bg-yellow-500/20 text-yellow-300 border-yellow-500/35"
              : "bg-emerald-500/20 text-emerald-300 border-emerald-500/35";

          return (
            <div key={r.category} className="glass-card p-3 flex flex-col justify-between w-full min-w-0">
              <div>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <AlertTriangle className={`h-3.5 w-3.5 shrink-0 ${r.score > 65 ? "text-red-400" : r.score > 45 ? "text-amber-400" : "text-emerald-400"}`} />
                    <p className="font-display text-xs font-semibold truncate">{r.category} Risk</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <span className={`rounded px-1.5 py-0.5 text-[9px] font-semibold uppercase border ${sevBadge}`}>
                      {sev}
                    </span>
                    <span className="font-mono text-xs font-bold text-[color:var(--foreground)]">
                      {r.score}/100
                    </span>
                  </div>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/5 w-full">
                  <div
                    className={`h-full rounded-full ${r.score > 65 ? "bg-red-500" : r.score > 45 ? "bg-[color:var(--accent)]" : "bg-emerald-500"}`}
                    style={{ width: `${r.score}%` }}
                  />
                </div>
                <p className="mt-2 text-[11px] text-[color:var(--muted-foreground)] line-clamp-2">{r.note}</p>
              </div>

              {r.mitigation && (
                <div className="mt-2 pt-2 border-t border-white/5 text-[10px] text-white/90 flex items-start gap-1.5 min-w-0">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0 leading-tight line-clamp-2">
                    <strong className="text-emerald-400">Action: </strong>
                    {r.mitigation}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
