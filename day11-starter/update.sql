-- Supabase SQL Editor에 이 파일의 내용을 통째로 복사해서 Run 한 번.
-- 기존 applications 테이블에 새 컬럼 추가

alter table applications add column level text;
alter table applications add column availability text;
alter table applications add column experience text;
