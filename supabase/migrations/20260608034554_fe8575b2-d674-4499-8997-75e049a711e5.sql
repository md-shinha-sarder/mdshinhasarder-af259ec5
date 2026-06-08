-- Restrict public read of site_settings to non-sensitive columns only.
-- Drop the public SELECT policy; admins keep ALL via update policy + new admin select.
DROP POLICY IF EXISTS "Settings public read" ON public.site_settings;

CREATE POLICY "Admins read settings" ON public.site_settings
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- Public-safe view excluding contact_email and contact_phone.
CREATE OR REPLACE VIEW public.site_settings_public
WITH (security_invoker = off) AS
SELECT id, site_title, site_tagline, logo_url, favicon_url,
       primary_color, background_color, font_heading, font_body,
       seo_title, seo_description, seo_keywords,
       social_facebook, social_twitter, social_youtube,
       social_github, social_website, updated_at
FROM public.site_settings;

GRANT SELECT ON public.site_settings_public TO anon, authenticated;