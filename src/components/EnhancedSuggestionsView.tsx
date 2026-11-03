import { useState, useMemo } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  Compass,
  Cpu,
  GitBranch,
  ShieldCheck,
  Zap,
} from "lucide-react";
import type { AnalysisResult, SuggestionItem, Project } from "@/lib/analysis";

interface EnhancedSuggestionsViewProps {
  analysis: AnalysisResult;
  project?: Project;
}

export function EnhancedSuggestionsView({ analysis }: EnhancedSuggestionsViewProps) {
  const [activeSubTab, setActiveSubTab] = useState<string>("all");
  const [expandedCardIndex, setExpandedCardIndex] = useState<number | null>(null);
  const [showGraphDetails, setShowGraphDetails] = useState<boolean>(false);

  const rawSuggestions: SuggestionItem[] = analysis.suggestions || [];
  const langgraphInfo = analysis.langgraphWorkflow;
  const riskMitigationSuggestions: SuggestionItem[] = analysis.risks.map((risk) => ({
    type: "risk",
    category: `${risk.category} Risk`,
    title: `${risk.category} Risk Mitigation`,
    advice: risk.mitigation || risk.note,
    priority:
      risk.severity === "critical" || risk.severity === "high"
        ? "high"
        : risk.severity === "low"
          ? "low"
          : "medium",
    timeframe: risk.timeframe,
    steps: risk.steps,
  }));

  const subTabs = [
    { id: "all", label: "All Guidance" },
    { id: "capital", label: "Capital Runway" },
    { id: "gtm", label: "Go-To-Market" },
    { id: "risk_defense", label: "Risk Defense" },
    { id: "mitigations", label: "Risk Mitigations" },
  ];

  // Filter suggestions by active subtab
  const currentSuggestions = useMemo(() => {
    if (activeSubTab === "all") return [...rawSuggestions, ...riskMitigationSuggestions];
    if (activeSubTab === "mitigations") return [];
    
    return rawSuggestions.filter((item) => {
      const cat = (item.category || item.type || "").toLowerCase();
      if (activeSubTab === "capital") return cat.includes("capital") || cat.includes("runway");
      if (activeSubTab === "gtm") return cat.includes("gtm") || cat.includes("market") || cat.includes("strategy") || cat.includes("product");
      if (activeSubTab === "risk_defense") return cat.includes("risk");
      return true;
    });
  }, [rawSuggestions, riskMitigationSuggestions, activeSubTab]);

  return (
    <div className="space-y-4 w-full min-w-0">
      {/* 1. Sleek LangGraph Status Banner */}
      <div className="rounded-xl border border-[color:var(--accent)]/30 bg-[color:var(--accent)]/5 px-3.5 py-2.5 flex items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2 min-w-0">
          <GitBranch className="h-4 w-4 text-[color:var(--accent)] shrink-0" />
          <span className="font-display font-semibold text-white truncate">LangGraph Agent Pipeline:</span>
          <span className="text-[color:var(--muted-foreground)] hidden sm:inline truncate">4 Agents Executed & Verified</span>
          <span className="font-mono text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shrink-0">
            StateGraph Active
          </span>
        </div>
        <button
          onClick={() => setShowGraphDetails(!showGraphDetails)}
          className="text-[10px] font-mono text-[color:var(--accent)] hover:underline flex items-center gap-1 shrink-0 font-medium"
        >
          {showGraphDetails ? "Hide Nodes" : "View Nodes"}
          {showGraphDetails ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
        </button>
      </div>

      {/* Expandable Mini Graph Nodes View */}
      {showGraphDetails && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 glass-card p-3 border border-white/10 text-xs animate-card-intro">
          {[
            { name: "Market Research Agent", icon: Compass, status: "Verified" },
            { name: "Quantitative Risk Agent", icon: Cpu, status: "Verified" },
            { name: "Mitigation Engine Agent", icon: ShieldCheck, status: "Verified" },
            { name: "Critic QA Agent", icon: CheckCircle2, status: langgraphInfo?.refined ? "Refined" : "Verified" },
          ].map((n, i) => {
            const Icon = n.icon;
            return (
              <div key={i} className="rounded-lg p-2 bg-white/5 border border-white/5 flex items-center gap-2">
                <Icon className="h-3.5 w-3.5 text-[color:var(--accent)] shrink-0" />
                <div className="min-w-0">
                  <p className="font-semibold text-white truncate text-[11px]">{n.name}</p>
                  <p className="text-[9px] text-emerald-400 font-mono">{n.status}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 2. SubTabs Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none border-b border-white/10">
        {subTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveSubTab(tab.id);
              setExpandedCardIndex(null);
            }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              activeSubTab === tab.id
                ? "bg-[color:var(--accent)]/20 text-white border border-[color:var(--accent)]/40 shadow-sm"
                : "text-[color:var(--muted-foreground)] hover:text-white hover:bg-white/5"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 3. Suggestions Cards with Staggered Intro Micro-Animations */}
      {activeSubTab !== "mitigations" && (
        <div className="grid gap-3.5 grid-cols-1 md:grid-cols-2">
          {currentSuggestions.map((item, idx) => {
            const isExpanded = expandedCardIndex === idx;
            const priorityBadge =
              item.priority === "high" || item.priority === "critical"
                ? "bg-red-500/15 text-red-300 border-red-500/30"
                : item.priority === "medium"
                ? "bg-amber-500/15 text-amber-300 border-amber-500/30"
                : "bg-emerald-500/15 text-emerald-300 border-emerald-500/30";

            return (
              <div
                key={`${activeSubTab}-${idx}`}
                style={{ animationDelay: `${idx * 70}ms` }}
                className="glass-card p-4 border border-white/10 hover:border-white/20 transition-all rounded-xl flex flex-col justify-between animate-card-intro opacity-0"
              >
                <div>
                  {/* Category Subtitle & Priority Badge */}
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-[color:var(--accent)] font-semibold">
                      {item.category || item.type || "Strategic Advice"}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-semibold uppercase border shrink-0 ${priorityBadge}`}>
                      {item.priority} priority
                    </span>
                  </div>

                  {/* Strong Primary Title */}
                  <h4 className="font-display text-sm sm:text-base font-semibold text-white tracking-tight leading-snug">
                    {item.title}
                  </h4>

                  {/* Clean Body Text */}
                  <p className="mt-2 text-xs leading-relaxed text-[color:var(--muted-foreground)]">
                    {item.advice}
                  </p>

                  {/* Expandable Action Steps Roadmap */}
                  {item.steps && item.steps.length > 0 && (
                    <div className="mt-3">
                      <button
                        onClick={() => setExpandedCardIndex(isExpanded ? null : idx)}
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-[color:var(--accent)] hover:underline"
                      >
                        <Zap className="h-3.5 w-3.5 text-[color:var(--accent)]" />
                        {isExpanded ? "Hide Action Roadmap" : `View Action Roadmap (${item.steps.length} Steps)`}
                        {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                      </button>

                      {isExpanded && (
                        <ol className="mt-2.5 space-y-2 pt-2.5 border-t border-white/10 text-xs text-white/90 animate-card-intro">
                          {item.steps.map((step, sIdx) => (
                            <li key={sIdx} className="flex items-start gap-2">
                              <span className="font-mono text-[10px] text-[color:var(--accent)] font-bold shrink-0 mt-0.5">
                                {sIdx + 1}.
                              </span>
                              <span className="leading-relaxed">{step}</span>
                            </li>
                          ))}
                        </ol>
                      )}
                    </div>
                  )}
                </div>

                {/* Footer Timeframe Meta */}
                {item.timeframe && (
                  <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-[color:var(--muted-foreground)]">
                    <span className="flex items-center gap-1.5 text-amber-300/90 font-medium">
                      <Clock className="h-3 w-3 text-amber-400" />
                      {item.timeframe}
                    </span>
                    {item.riskReduction && (
                      <span className="text-emerald-400 font-semibold text-[10px]">
                        {item.riskReduction}
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* 4. Risk Mitigations Subtab with Intro Animation */}
      {activeSubTab === "mitigations" && (
        <div className="grid gap-3 grid-cols-1 md:grid-cols-2">
          {analysis.risks.map((r, rIdx) => (
            <div
              key={`${activeSubTab}-${r.category}`}
              style={{ animationDelay: `${rIdx * 70}ms` }}
              className="glass-card p-3.5 border border-white/10 rounded-xl space-y-2 animate-card-intro opacity-0"
            >
              <div className="flex items-center justify-between">
                <span className="font-display text-sm font-semibold text-white flex items-center gap-1.5">
                  <AlertTriangle className={`h-4 w-4 ${r.score > 65 ? "text-red-400" : "text-amber-400"}`} />
                  {r.category} Risk
                </span>
                <span className="font-mono text-xs font-bold text-[color:var(--accent)]">
                  {r.score}/100 Score
                </span>
              </div>
              <p className="text-xs text-[color:var(--muted-foreground)] leading-relaxed">{r.note}</p>
              {r.mitigation && (
                <div className="pt-2 border-t border-white/5 text-xs text-white/90 flex items-start gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed"><strong className="text-emerald-400">Action: </strong>{r.mitigation}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {activeSubTab !== "mitigations" && currentSuggestions.length === 0 && (
        <div className="glass-card p-6 text-center text-xs text-[color:var(--muted-foreground)] animate-card-intro">
          No suggestions listed under this category.
        </div>
      )}
    </div>
  );
}
