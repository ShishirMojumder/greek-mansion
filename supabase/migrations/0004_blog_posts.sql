-- Admin-managed SEO blog posts.
create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text not null,
  category text not null,
  content text not null,
  cover_url text not null,
  cover_alt text not null,
  meta_title text,
  meta_description text,
  focus_keyword text,
  is_published boolean not null default false,
  published_at timestamptz,
  author_id uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists blog_posts_published_idx
  on public.blog_posts (is_published, published_at desc);

drop trigger if exists trg_blog_posts_updated on public.blog_posts;
create trigger trg_blog_posts_updated
  before update on public.blog_posts
  for each row execute function public.set_updated_at();

alter table public.blog_posts enable row level security;

drop policy if exists blog_posts_read on public.blog_posts;
create policy blog_posts_read on public.blog_posts
  for select to anon, authenticated
  using (is_published or public.is_admin());

drop policy if exists blog_posts_write on public.blog_posts;
create policy blog_posts_write on public.blog_posts
  for all to authenticated
  using (public.is_admin()) with check (public.is_admin());
