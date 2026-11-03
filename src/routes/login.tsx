import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Eye, LockKeyhole, Mail, Sparkles, UserRound } from "lucide-react";
import { useState } from "react";

import { clearSessionToken, loginUser, registerUser } from "@/lib/local-api";
import { startDemoSession } from "@/lib/demo-session";
import { Logo } from "@/components/logo";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in | Smart Failure Detection" },
      { name: "description", content: "Sign in to save and revisit your project analyses." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"sign-in" | "sign-up">("sign-in");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setNotice(null);
    setSubmitting(true);

    try {
      clearSessionToken();
      const result =
        mode === "sign-in"
          ? await loginUser({ email, password })
          : await registerUser({ name: name.trim(), email, password });
      // Supabase handles session storage internally
      setSubmitting(false);
      void navigate({ to: mode === "sign-up" ? "/" : "/profile" });
      return;
    } catch (error) {
      setSubmitting(false);
      setError(error instanceof Error ? error.message : "Something went wrong.");
      return;
    }
  }

  function joinDemo() {
    setError(null);
    setNotice(null);
    startDemoSession();
    void navigate({ to: "/project-input" });
  }

  return (
    <main className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl items-center gap-10 px-6 py-12 md:grid-cols-[1.1fr_0.9fr] md:px-8">
      <section>
        <div className="mb-6">
          <Logo size="lg" />
        </div>
        <h1 className="max-w-xl font-display text-4xl font-semibold tracking-tight sm:text-5xl">

          Keep every decision within reach.
        </h1>
        <p className="mt-5 max-w-lg text-base text-[color:var(--muted-foreground)]">
          Sign in to keep a private history of your project analyses, risks, market signals, and next moves.
        </p>
        <div className="mt-8 space-y-4 text-sm text-[color:var(--muted-foreground)]">
          <Feature icon={UserRound} text="A personal workspace for every account" />
          <Feature icon={Eye} text="Reopen completed analyses anytime" />
          <Feature icon={LockKeyhole} text="History protected by a local session token" />
        </div>
      </section>

      <section className="glass-card p-6 sm:p-8">
        <div className="flex rounded-lg border border-white/10 bg-white/[0.03] p-1">
          {(["sign-in", "sign-up"] as const).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => {
                setMode(item);
                setError(null);
                setNotice(null);
              }}
              className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                mode === item ? "bg-[color:var(--accent)] text-[color:var(--accent-foreground)]" : "text-[color:var(--muted-foreground)]"
              }`}
            >
              {item === "sign-in" ? "Sign in" : "Create account"}
            </button>
          ))}
        </div>

        <form className="mt-6 space-y-4" onSubmit={(event) => void submit(event)}>
          {mode === "sign-up" && (
            <AuthField label="Your name" icon={UserRound}>
              <input value={name} onChange={(event) => setName(event.target.value)} required className={inputClass} placeholder="Your name" />
            </AuthField>
          )}
          <AuthField label="Email" icon={Mail}>
            <input value={email} onChange={(event) => setEmail(event.target.value)} required type="email" className={inputClass} placeholder="you@example.com" />
          </AuthField>
          <AuthField label="Password" icon={LockKeyhole}>
            <input value={password} onChange={(event) => setPassword(event.target.value)} required minLength={6} type="password" className={inputClass} placeholder="At least 6 characters" />
          </AuthField>
          {error && <p className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">{error}</p>}
          {notice && <p className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">{notice}</p>}
          <button disabled={submitting} className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[color:var(--accent)] px-4 py-3 text-sm font-medium text-[color:var(--accent-foreground)] transition-all hover:brightness-110 disabled:opacity-60">
            {submitting ? "Please wait..." : mode === "sign-in" ? "Sign in" : "Create account"}
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <div className="my-6 flex items-center gap-3 text-xs text-[color:var(--muted-foreground)] before:h-px before:flex-1 before:bg-white/10 after:h-px after:flex-1 after:bg-white/10">or</div>
        <button type="button" disabled={submitting} onClick={joinDemo} className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-[color:var(--accent)]/40 bg-[color:var(--accent)]/10 px-4 py-3 text-sm font-medium text-[color:var(--accent)] transition-colors hover:bg-[color:var(--accent)]/15 disabled:opacity-60">
          <Sparkles className="h-4 w-4" />
          Join as demo guest
        </button>
        <p className="mt-4 text-center text-xs text-[color:var(--muted-foreground)]">
          A demo guest keeps history in this browser session. <Link to="/" className="text-[color:var(--accent)] hover:underline">Back to overview</Link>
        </p>
      </section>
    </main>
  );
}

const inputClass = "w-full rounded-lg border border-white/10 bg-[color:var(--card-solid)]/60 px-3.5 py-2.5 text-sm text-[color:var(--foreground)] outline-none transition focus:border-[color:var(--accent)]/50 focus:ring-2 focus:ring-[color:var(--accent)]/20";

function AuthField({ label, icon: Icon, children }: { label: string; icon: React.ComponentType<{ className?: string }>; children: React.ReactNode }) {
  return <label className="block"><span className="mb-1.5 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.15em] text-[color:var(--muted-foreground)]"><Icon className="h-3.5 w-3.5" />{label}</span>{children}</label>;
}

function Feature({ icon: Icon, text }: { icon: React.ComponentType<{ className?: string; strokeWidth?: number }>; text: string }) {
  return <div className="flex items-center gap-3"><span className="flex h-8 w-8 items-center justify-center rounded-md bg-[color:var(--accent)]/10"><Icon className="h-4 w-4 text-[color:var(--accent)]" strokeWidth={1.5} /></span>{text}</div>;
}
