-- keep-alive heartbeat: Supabase Free tier 자동 pause 방지용 write ping 대상.
-- pause 판정은 주간 "user database activity" 볼륨 기준(매일 수 회 요청 필요)이므로
-- GH Actions(github)·Vercel Cron(vercel)이 매일 이 RPC로 write를 남긴다.
-- source별 행이라 어느 경보망이 죽었는지 pinged_at으로 감사 가능.
create table if not exists public.keep_alive (
  source text primary key check (source in ('github', 'vercel', 'manual')),
  pinged_at timestamptz not null default now()
);

-- RLS on + 정책 0개(의도): REST 직접 접근 전면 차단. 쓰기 통로는 아래 RPC뿐.
alter table public.keep_alive enable row level security;

-- SECURITY DEFINER: anon이 테이블 정책 없이도 단일 행 upsert만 가능.
-- src는 허용된 source 값으로만 정규화(lower+trim) — 검증 없이 통과시키면
-- 외부에서 임의 문자열로 실경보망(github/vercel) 행을 스푸핑해 장애를 은폐할 수 있고,
-- anon 공개 키 특성상 무제한 문자열로 행이 계속 증식할 수 있다.
create or replace function public.keep_alive_ping(src text default 'manual')
returns timestamptz
language plpgsql
security definer
set search_path = public
as $$
declare
  normalized text := lower(trim(coalesce(src, '')));
  result timestamptz;
begin
  if normalized = '' then
    normalized := 'manual';
  end if;

  if normalized not in ('github', 'vercel', 'manual') then
    raise exception 'keep_alive_ping: invalid source %', src
      using errcode = '22023';
  end if;

  insert into public.keep_alive (source, pinged_at)
  values (normalized, now())
  on conflict (source) do update set pinged_at = now()
  returning pinged_at into result;

  return result;
end;
$$;

revoke all on function public.keep_alive_ping(text) from public;
grant execute on function public.keep_alive_ping(text) to anon, authenticated;
