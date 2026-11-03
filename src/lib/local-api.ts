import { createClient } from "@supabase/supabase-js";
import type { Project } from "@/lib/analysis";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8787";
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const SUPABASE_CONFIG_ERROR =
  "Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env, then restart the frontend.";

// Keep client initialization safe so the page can show a useful configuration
// error instead of a browser-level "Failed to fetch" message.
export const supabase = createClient(
  SUPABASE_URL || "https://placeholder-project.supabase.co",
  SUPABASE_ANON_KEY || "placeholder-anon-key",
  {
  auth: {
    persistSession: typeof window !== "undefined",
    autoRefreshToken: typeof window !== "undefined",
  },
  },
);

export type LocalUser = {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  createdAt: string;
};

export type ProjectRecord = Project & {
  id: string;
  created_at: string;
  user_id: string;
};

// Listen to Supabase Auth state changes only in browser
if (typeof window !== "undefined") {
  try {
    supabase.auth.onAuthStateChange(() => {
      window.dispatchEvent(new Event("smart-failure-auth-change"));
    });
  } catch (err) {
    console.warn("Supabase auth listener initialization failed:", err);
  }
}

export async function registerUser(input: { name: string; email: string; password: string }) {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) throw new Error(SUPABASE_CONFIG_ERROR);

  const { data, error } = await supabase.auth.signUp({
    email: input.email,
    password: input.password,
    options: {
      data: {
        name: input.name,
      },
    },
  });

  if (error) throw new Error(error.message);
  if (!data.user) throw new Error("User creation failed");

  return {
    token: data.session?.access_token ?? "",
    user: {
      id: data.user.id,
      email: data.user.email!,
      name: data.user.user_metadata.name || input.name,
      createdAt: data.user.created_at,
    } as LocalUser,
  };
}

export async function loginUser(input: { email: string; password: string }) {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) throw new Error(SUPABASE_CONFIG_ERROR);

  const { data, error } = await supabase.auth.signInWithPassword({
    email: input.email,
    password: input.password,
  });

  if (error) throw new Error(error.message);
  if (!data.user) throw new Error("Login failed");

  return {
    token: data.session?.access_token ?? "",
    user: {
      id: data.user.id,
      email: data.user.email!,
      name: data.user.user_metadata.name || input.email,
      createdAt: data.user.created_at,
    } as LocalUser,
  };
}

export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return { user: null };

  return {
    user: {
      id: user.id,
      email: user.email!,
      name: user.user_metadata.name || user.email!,
      createdAt: user.created_at,
    } as LocalUser,
  };
}

export async function clearSessionToken() {
  await supabase.auth.signOut();
}

export async function listProjects() {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return { projects: data as ProjectRecord[] };
}

export async function getProject(projectId: string) {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", projectId)
    .single();

  if (error) throw new Error(error.message);
  return { project: data as ProjectRecord };
}

// These two functions still call our Node backend because they must run the Python ML Model
export async function createProject(input: Project) {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;
  
  const response = await fetch(`${API_BASE_URL}/api/projects`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { "x-supabase-token": token } : {}),
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: "Failed to create project" }));
    throw new Error(err.error || "Failed to create project");
  }

  return response.json();
}

export async function analyzeProject(input: Project) {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;

  const response = await fetch(`${API_BASE_URL}/api/analyze`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { "x-supabase-token": token } : {}),
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: "Analysis failed" }));
    throw new Error(err.error || "Analysis failed");
  }

  return response.json();
}

