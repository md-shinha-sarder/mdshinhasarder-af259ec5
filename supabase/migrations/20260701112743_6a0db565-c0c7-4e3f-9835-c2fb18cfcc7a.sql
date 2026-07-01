ALTER TABLE public.pages ADD COLUMN IF NOT EXISTS images text[] NOT NULL DEFAULT '{}'::text[];
ALTER TABLE public.pages ADD COLUMN IF NOT EXISTS cover_url text;