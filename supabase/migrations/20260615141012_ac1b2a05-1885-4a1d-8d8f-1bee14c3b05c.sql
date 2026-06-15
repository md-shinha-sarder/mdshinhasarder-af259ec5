
-- Create admin-only contact table
CREATE TABLE public.site_contact (
  id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  contact_email TEXT,
  contact_phone TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_contact TO authenticated;
GRANT ALL ON public.site_contact TO service_role;

ALTER TABLE public.site_contact ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins read contact" ON public.site_contact
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins write contact" ON public.site_contact
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Migrate any existing values
INSERT INTO public.site_contact (id, contact_email, contact_phone)
SELECT 1, contact_email, contact_phone FROM public.site_settings WHERE id = 1
ON CONFLICT (id) DO UPDATE SET
  contact_email = EXCLUDED.contact_email,
  contact_phone = EXCLUDED.contact_phone;

-- Drop public-facing view if it references the columns, recreate after column drop
DROP VIEW IF EXISTS public.site_settings_public;

-- Remove sensitive columns from site_settings
ALTER TABLE public.site_settings DROP COLUMN IF EXISTS contact_email;
ALTER TABLE public.site_settings DROP COLUMN IF EXISTS contact_phone;

-- Recreate the public-safe view without contact fields
CREATE VIEW public.site_settings_public AS
SELECT id, site_title, site_tagline, logo_url, favicon_url,
       primary_color, background_color, font_heading, font_body,
       seo_title, seo_description, seo_keywords,
       social_facebook, social_twitter, social_youtube, social_github, social_website,
       updated_at
FROM public.site_settings;

GRANT SELECT ON public.site_settings_public TO anon, authenticated;

-- Replace permissive RLS with role-scoped policies
DROP POLICY IF EXISTS "Settings public read safe cols" ON public.site_settings;

CREATE POLICY "Anyone reads safe settings" ON public.site_settings
  FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY "Admins read settings" ON public.site_settings
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
