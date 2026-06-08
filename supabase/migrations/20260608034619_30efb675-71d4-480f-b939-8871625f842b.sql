ALTER VIEW public.site_settings_public SET (security_invoker = on);

-- Allow anon/authenticated to read non-sensitive columns directly via column privileges
GRANT SELECT (id, site_title, site_tagline, logo_url, favicon_url,
              primary_color, background_color, font_heading, font_body,
              seo_title, seo_description, seo_keywords,
              social_facebook, social_twitter, social_youtube,
              social_github, social_website, updated_at)
ON public.site_settings TO anon, authenticated;

-- Public read policy restricted only to safe columns is enforced via grants;
-- recreate the SELECT policy permitting all so column grants govern access.
DROP POLICY IF EXISTS "Admins read settings" ON public.site_settings;
CREATE POLICY "Settings public read safe cols" ON public.site_settings
  FOR SELECT USING (true);