import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CalendarDays, ClipboardList, Mail, Plus, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getDemoProjects, hasDemoSession } from "@/lib/demo-session";
import { getCurrentUser, listProjects } from "@/lib/local-api";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profile | Signal" },
      {
        name: "description",
        content: "View your Signal workspace profile and analysis history.",
      },
    ],
  }),
  component: ProfilePage,
});

type ProjectHistory = {
  id: string;
  name: string;
  industry: string;
  business_model: string;
  target_market: string;
  budget: number;
  created_at: string;
};

type Profile = {
  name: string;
  email: string;
  initials: string;
  avatarUrl?: string;
  createdAt?: string;
  isDemo?: boolean;
};

function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [history, setHistory] = useState<ProjectHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadProfile() {
      const { user } = await getCurrentUser();

      if (!active) return;

      if (!user) {
        if (hasDemoSession()) {
          setProfile({
            name: "Demo User",
            email: "demo@smartfailure.local",
            initials: "DU",
            createdAt: new Date().toISOString(),
            isDemo: true,
          });
          setHistory(getDemoProjects());
        }
        setLoading(false);
        return;
      }

      if (user) {
        const email = user.email ?? "";
        const name = user.name || email || "Workspace member";
        const initials =
          name
            .split(/\s+/)
            .filter(Boolean)
            .slice(0, 2)
            .map((part: string) => part[0])
            .join("")
            .toUpperCase() || "SF";

        setProfile({
          name,
          email,
          initials,
          avatarUrl: user.avatarUrl,
          createdAt: user.createdAt,
        });
      }

      const { projects } = await listProjects();
      setHistory(projects.slice(0, 8));
      setLoading(false);
    }

    void loadProfile();
    return () => {
      active = false;
    };
  }, []);

  return (
    <main className="mx-auto max-w-6xl px-6 py-12 md:px-8 md:py-16">
      <section className="glass-card overflow-hidden">
        <div className="relative border-b border-white/8 px-6 py-8 md:px-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.18),transparent_42%)]" />
          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center">
            <Avatar className="h-20 w-20 border-2 border-[color:var(--accent)]/40 shadow-[0_0_32px_rgba(245,158,11,0.2)]">
              {profile?.avatarUrl && <AvatarImage src={profile.avatarUrl} alt={profile.name} />}
              <AvatarFallback className="bg-[color:var(--accent)]/15 font-display text-xl font-semibold text-[color:var(--accent)]">
                {profile?.initials ?? "SF"}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[color:var(--accent)]">
                Workspace profile
              </p>
              <h1 className="mt-2 truncate font-display text-3xl font-semibold tracking-tight sm:text-4xl">
                {profile?.name ?? "Your profile"}
              </h1>
              <p className="mt-2 flex items-center gap-2 text-sm text-[color:var(--muted-foreground)]">
                <Mail className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{profile?.email || "Sign in to personalise your workspace"}</span>
              </p>
            </div>
            <Link
              to="/project-input"
              className="inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-lg bg-[color:var(--accent)] px-4 py-2.5 text-sm font-medium text-[color:var(--accent-foreground)] transition-all hover:brightness-110 hover:shadow-[0_0_24px_rgba(245,158,11,0.35)]"
            >
              <Plus className="h-4 w-4" />
              New analysis
            </Link>
          </div>
        </div>

        <div className="grid divide-y divide-white/8 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          <ProfileStat icon={ClipboardList} label="Saved analyses" value={loading ? "..." : String(history.length)} />
          <ProfileStat
            icon={CalendarDays}
            label="Member since"
            value={profile?.createdAt ? formatMonth(profile.createdAt) : "Not signed in"}
          />
          <ProfileStat icon={Sparkles} label="Workspace status" value={profile ? "Active" : "Guest"} accent />
        </div>
      </section>

      <section className="mt-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[color:var(--accent)]">
              Analysis history
            </p>
            <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight">{profile?.isDemo ? "Your demo analyses" : "Your saved analyses"}</h2>
          </div>
          <p className="max-w-md text-sm text-[color:var(--muted-foreground)]">
            {profile?.isDemo ? "Demo history is saved in this browser only." : "Your latest saved project assessments."}
          </p>
        </div>

        {!profile && !loading ? (
          <div className="glass-card mt-5 flex min-h-48 flex-col items-center justify-center px-6 text-center">
            <Sparkles className="h-7 w-7 text-[color:var(--accent)]" strokeWidth={1.5} />
            <h3 className="mt-3 font-display text-lg font-semibold">Make this workspace yours</h3>
            <p className="mt-1 max-w-sm text-sm text-[color:var(--muted-foreground)]">
              Sign in to keep your analyses private and return to them whenever you need.
            </p>
            <Link
              to="/login"
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[color:var(--accent)] px-4 py-2 text-sm font-medium text-[color:var(--accent-foreground)]"
            >
              Sign in <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : loading ? (
          <div className="mt-5 grid gap-3">
            {[1, 2, 3].map((item) => (
              <div key={item} className="glass-card h-20 animate-pulse bg-white/[0.03]" />
            ))}
          </div>
        ) : error ? (
          <div className="glass-card mt-5 px-5 py-4 text-sm text-red-300">Could not load history: {error}</div>
        ) : history.length ? (
          <div className="mt-5 overflow-hidden rounded-xl border border-white/8">
            {history.map((project) => (
              <Link
                to="/projects/$projectId"
                params={{ projectId: project.id }}
                key={project.id}
                className="grid gap-3 border-b border-white/8 bg-[color:var(--card)]/60 px-5 py-4 transition-colors last:border-0 hover:bg-white/[0.04] sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center"
              >
                <div className="min-w-0">
                  <h3 className="truncate font-display text-base font-semibold">{project.name}</h3>
                  <p className="mt-1 truncate text-sm text-[color:var(--muted-foreground)]">
                    {project.industry} <span className="px-1 text-white/20">/</span> {project.business_model || "Model not set"}
                  </p>
                </div>
                <div className="flex items-center justify-between gap-4 sm:block sm:text-right">
                  <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[color:var(--accent)]">
                    {formatDate(project.created_at)}
                  </p>
                  <p className="mt-1 text-xs text-[color:var(--muted-foreground)]">
                    ${project.budget.toLocaleString()} budget
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="glass-card mt-5 flex min-h-48 flex-col items-center justify-center px-6 text-center">
            <ClipboardList className="h-7 w-7 text-[color:var(--accent)]" strokeWidth={1.5} />
            <h3 className="mt-3 font-display text-lg font-semibold">No analyses yet</h3>
            <p className="mt-1 max-w-sm text-sm text-[color:var(--muted-foreground)]">
              Start with a project submission and your saved analysis will appear here.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}

function ProfileStat({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="flex items-center gap-3 px-5 py-4 md:px-6">
      <Icon className="h-4 w-4 text-[color:var(--accent)]" strokeWidth={1.5} />
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[color:var(--muted-foreground)]">{label}</p>
        <p className={`mt-0.5 font-display text-base font-semibold ${accent ? "text-[color:var(--accent)]" : ""}`}>{value}</p>
      </div>
    </div>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", { day: "numeric", month: "short", year: "numeric" }).format(
    new Date(value),
  );
}

function formatMonth(value: string) {
  return new Intl.DateTimeFormat("en", { month: "long", year: "numeric" }).format(new Date(value));
}
