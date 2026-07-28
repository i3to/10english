begin;

alter table public.teams
  add column if not exists join_code text;

update public.teams
set join_code = upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8))
where join_code is null;

alter table public.teams
  alter column join_code set default upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8)),
  alter column join_code set not null;

create unique index if not exists teams_join_code_key
  on public.teams(join_code);

create or replace function public.join_team_by_code(p_code text)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_team_id uuid;
begin
  if (select auth.uid()) is null then
    raise exception 'يجب تسجيل الدخول أولاً';
  end if;

  select id into v_team_id
  from public.teams
  where upper(join_code) = upper(trim(p_code))
  limit 1;

  if v_team_id is null then
    raise exception 'رمز المجموعة غير صحيح';
  end if;

  insert into public.team_members(team_id,user_id,role)
  values(v_team_id,(select auth.uid()),'member')
  on conflict(team_id,user_id) do nothing;

  return v_team_id;
end;
$$;

revoke all on function public.join_team_by_code(text) from public;
grant execute on function public.join_team_by_code(text) to authenticated;

commit;
