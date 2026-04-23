-- ============================================================
-- FoodLogic — Supabase Schema
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ── Profiles ────────────────────────────────────────────────
create table public.profiles (
  id               uuid references auth.users on delete cascade primary key,
  name             text not null,
  title            text not null,
  country          text not null,
  role             text not null default 'student' check (role in ('student','professional','admin')),
  bio              text,
  specializations  text[] default '{}',
  is_verified      boolean default false,
  years_experience integer,
  created_at       timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone"
  on public.profiles for select using (true);

create policy "Users can insert their own profile"
  on public.profiles for insert with check (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update using (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, name, title, country, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', 'New Member'),
    coalesce(new.raw_user_meta_data->>'title', 'Member'),
    coalesce(new.raw_user_meta_data->>'country', 'Unknown'),
    coalesce(new.raw_user_meta_data->>'role', 'student')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ── Questions ───────────────────────────────────────────────
create table public.questions (
  id           uuid default uuid_generate_v4() primary key,
  author_id    uuid references public.profiles(id) on delete cascade not null,
  title        text not null,
  body         text not null,
  category     text not null check (category in ('food_science','dairy_tech','engineering','career')),
  tags         text[] default '{}',
  is_answered  boolean default false,
  answer_count integer default 0,
  view_count   integer default 0,
  created_at   timestamptz default now()
);

alter table public.questions enable row level security;

create policy "Questions viewable by everyone"
  on public.questions for select using (true);

create policy "Authenticated users can post questions"
  on public.questions for insert with check (auth.uid() = author_id);

create policy "Authors can update their questions"
  on public.questions for update using (auth.uid() = author_id);

-- ── Answers ─────────────────────────────────────────────────
create table public.answers (
  id           uuid default uuid_generate_v4() primary key,
  question_id  uuid references public.questions(id) on delete cascade not null,
  author_id    uuid references public.profiles(id) on delete cascade not null,
  body         text not null,
  upvotes      integer default 0,
  is_accepted  boolean default false,
  created_at   timestamptz default now()
);

alter table public.answers enable row level security;

create policy "Answers viewable by everyone"
  on public.answers for select using (true);

create policy "Verified professionals can post answers"
  on public.answers for insert with check (
    auth.uid() = author_id and
    exists (
      select 1 from public.profiles
      where id = auth.uid()
      and (is_verified = true or role = 'professional' or role = 'admin')
    )
  );

create policy "Authors can update their answers"
  on public.answers for update using (auth.uid() = author_id);

-- Auto-increment answer_count on question
create or replace function public.increment_answer_count()
returns trigger language plpgsql as $$
begin
  update public.questions
  set answer_count = answer_count + 1,
      is_answered  = true
  where id = new.question_id;
  return new;
end;
$$;

create trigger on_answer_created
  after insert on public.answers
  for each row execute procedure public.increment_answer_count();

-- ── Mentor Requests ─────────────────────────────────────────
create table public.mentor_requests (
  id           uuid default uuid_generate_v4() primary key,
  from_user_id uuid references public.profiles(id) on delete cascade not null,
  to_mentor_id uuid references public.profiles(id) on delete cascade not null,
  message      text not null,
  status       text default 'pending' check (status in ('pending','accepted','declined')),
  created_at   timestamptz default now()
);

alter table public.mentor_requests enable row level security;

create policy "Users see their own requests"
  on public.mentor_requests for select
  using (auth.uid() = from_user_id or auth.uid() = to_mentor_id);

create policy "Authenticated users can send requests"
  on public.mentor_requests for insert with check (auth.uid() = from_user_id);

create policy "Mentors can update request status"
  on public.mentor_requests for update using (auth.uid() = to_mentor_id);

-- ── Upvotes ─────────────────────────────────────────────────
create table public.answer_upvotes (
  user_id   uuid references public.profiles(id) on delete cascade,
  answer_id uuid references public.answers(id) on delete cascade,
  primary key (user_id, answer_id)
);

alter table public.answer_upvotes enable row level security;

create policy "Users see all upvotes" on public.answer_upvotes for select using (true);
create policy "Users can upvote once"  on public.answer_upvotes for insert with check (auth.uid() = user_id);
create policy "Users can remove upvote" on public.answer_upvotes for delete using (auth.uid() = user_id);

-- Auto-update upvote count on answers
create or replace function public.handle_upvote_insert()
returns trigger language plpgsql as $$
begin
  update public.answers set upvotes = upvotes + 1 where id = new.answer_id;
  return new;
end;
$$;
create trigger on_upvote_added
  after insert on public.answer_upvotes
  for each row execute procedure public.handle_upvote_insert();

create or replace function public.handle_upvote_delete()
returns trigger language plpgsql as $$
begin
  update public.answers set upvotes = upvotes - 1 where id = old.answer_id;
  return old;
end;
$$;
create trigger on_upvote_removed
  after delete on public.answer_upvotes
  for each row execute procedure public.handle_upvote_delete();
