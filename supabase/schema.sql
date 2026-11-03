create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  industry text not null,
  business_model text not null,
  target_market text not null,
  budget numeric not null default 0,
  currency text not null default 'USD',
  description text not null,
  analysis_data jsonb,
  created_at timestamptz not null default now()
);

alter table public.projects
  add column if not exists currency text not null default 'USD';

alter table public.projects enable row level security;

drop policy if exists "Users can manage their own projects" on public.projects;
create policy "Users can manage their own projects"
  on public.projects
  for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

grant select, insert, update, delete on public.projects to authenticated;

