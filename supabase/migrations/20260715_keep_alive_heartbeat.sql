-- keep-alive heartbeat: Supabase Free tier 자동 pause 방지용 write ping 대상.
-- pause 판정은 주간 "user database activity" 볼륨 기준(매일 수 회 요청 필요)이므로
-- GH Actions(github)·Vercel Cron(vercel)이 매일 이 RPC로 write를 남긴다.
-- source별 행이라 어느 경보망이 죽었는지 pinged_at으로 감사 가능.
create table if not exists public.keep_alive (
  source text primary key,
  pinged_at timestamptz not null default now()
);

-- RLS on + 정책 0개(의도): REST 직접 접근 전면 차단. 쓰기 통로는 아래 RPC뿐.
alter table public.keep_alive enable row level security;

-- SECURITY DEFINER: anon이 테이블 정책 없이도 단일 행 upsert만 가능.
-- 파라미터는 left(...,20)으로 클램프 — 임의 값이 와도 피해가 타임스탬프 갱신을 넘지 못함.
create or replace function public.keep_alive_ping(src text default 'manual')
returns timestamptz
language sql
security definer
set search_path = public
as $$
  insert into public.keep_alive (source, pinged_at)
  values (left(coalesce(nullif(trim(src), ''), 'manual'), 20), now())
  on conflict (source) do update set pinged_at = now()
  returning pinged_at;
$$;

revoke all on function public.keep_alive_ping(text) from public;
grant execute on function public.keep_alive_ping(text) to anon, authenticated;
