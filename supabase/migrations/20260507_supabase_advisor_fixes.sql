-- Supabase Advisor cleanup
-- Fixes the SQL-side warnings from the exported advisor report.

-- 1. Lock down SECURITY DEFINER functions and set a fixed search_path.
do $$
begin
  if exists (
    select 1
    from pg_proc p
    join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public'
      and p.proname = 'handle_new_user'
  ) then
    execute 'alter function public.handle_new_user() set search_path = public';
    execute 'revoke execute on function public.handle_new_user() from public, anon, authenticated';
  end if;

  if exists (
    select 1
    from pg_proc p
    join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public'
      and p.proname = 'rls_auto_enable'
  ) then
    execute 'alter function public.rls_auto_enable() set search_path = public';
    execute 'revoke execute on function public.rls_auto_enable() from public, anon, authenticated';
  end if;
end
$$;

-- 2. Remove the broad public listing policy on the public profile bucket.
drop policy if exists "Public can view profile images" on storage.objects;

-- Public buckets do not need a SELECT policy for object URL access.
-- Keep uploads/updates controlled by authenticated policies only.

-- 3. Tighten permissive INSERT policies that were allowing anon/authenticated
-- users to insert with WITH CHECK (true).
do $$
begin
  if exists (
    select 1
    from information_schema.tables
    where table_schema = 'public'
      and table_name = 'conversations'
  ) then
    execute 'drop policy if exists "allow all insert conversations" on public.conversations';
    execute '
      create policy "allow authenticated insert conversations"
      on public.conversations
      for insert
      to authenticated
      with check (auth.uid() is not null)
    ';
  end if;

  if exists (
    select 1
    from information_schema.tables
    where table_schema = 'public'
      and table_name = 'messages'
  ) then
    execute 'drop policy if exists "allow all insert messages" on public.messages';
    execute '
      create policy "allow authenticated insert messages"
      on public.messages
      for insert
      to authenticated
      with check (auth.uid() is not null)
    ';
  end if;

  if exists (
    select 1
    from information_schema.tables
    where table_schema = 'public'
      and table_name = 'methods'
  ) then
    execute 'drop policy if exists "allow public insert methods" on public.methods';
    execute '
      create policy "allow authenticated insert methods"
      on public.methods
      for insert
      to authenticated
      with check (auth.uid() is not null)
    ';
  end if;
end
$$;
