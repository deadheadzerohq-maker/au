create table if not exists public.monitored_urls (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  url text not null,
  contact_email text not null,
  last_hash text,
  last_summary text,
  last_content text,
  last_checked_at timestamptz,
  created_at timestamptz default now()
);

create table if not exists public.change_events (
  id uuid primary key default gen_random_uuid(),
  monitored_url_id uuid not null references public.monitored_urls(id) on delete cascade,
  summary text not null,
  significance text not null,
  snapshot text,
  created_at timestamptz default now()
);

alter table public.monitored_urls enable row level security;
alter table public.change_events enable row level security;

create policy "Users can CRUD their URLs" on public.monitored_urls
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can read their change events" on public.change_events
  for select using (
    exists(
      select 1 from public.monitored_urls m
      where m.id = change_events.monitored_url_id
      and m.user_id = auth.uid()
    )
  );

create policy "Inserts via service" on public.change_events
  for insert with check (true);

-- helper function to keep contact_email in sync with the authenticated user
create or replace function public.sync_contact_email()
returns trigger as $$
begin
  if new.contact_email is null then
    new.contact_email := auth.jwt() ->> 'email';
  end if;
  if new.user_id is null then
    new.user_id := auth.uid();
  end if;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists set_contact_email on public.monitored_urls;
create trigger set_contact_email
before insert on public.monitored_urls
for each row execute function public.sync_contact_email();
