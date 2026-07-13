-- Adds a "favourite" flag to reflections so specific pieces can be pinned
-- to the homepage instead of relying purely on display_order.
-- Run this once in the Supabase SQL Editor.

alter table reflections add column if not exists is_favourite boolean not null default false;
alter table reflections add column if not exists favourited_at timestamptz;
