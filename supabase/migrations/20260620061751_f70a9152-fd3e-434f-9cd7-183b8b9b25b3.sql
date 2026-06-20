CREATE OR REPLACE VIEW public.site_settings_public AS
SELECT
  id,
  site_title,
  site_tagline,
  logo_url,
  favicon_url,
  primary_color,
  background_color,
  font_heading,
  font_body,
  seo_title,
  seo_description,
  seo_keywords,
  social_facebook,
  social_twitter,
  social_youtube,
  social_github,
  social_website,
  updated_at
FROM public.site_settings
WHERE id = 1;

GRANT SELECT ON public.site_settings_public TO anon;
GRANT SELECT ON public.site_settings_public TO authenticated;
GRANT ALL ON public.site_settings_public TO service_role;

DROP POLICY IF EXISTS "Anyone reads safe settings" ON public.site_settings;
REVOKE ALL ON public.site_settings FROM anon;
GRANT SELECT, UPDATE ON public.site_settings TO authenticated;
GRANT ALL ON public.site_settings TO service_role;