DROP VIEW IF EXISTS public.site_settings_public;

CREATE TABLE IF NOT EXISTS public.site_settings_public (
  id integer PRIMARY KEY DEFAULT 1,
  site_title text,
  site_tagline text,
  logo_url text,
  favicon_url text,
  primary_color text,
  background_color text,
  font_heading text,
  font_body text,
  seo_title text,
  seo_description text,
  seo_keywords text,
  social_facebook text,
  social_twitter text,
  social_youtube text,
  social_github text,
  social_website text,
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_settings_public TO anon;
GRANT SELECT ON public.site_settings_public TO authenticated;
GRANT ALL ON public.site_settings_public TO service_role;
ALTER TABLE public.site_settings_public ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public reads safe settings" ON public.site_settings_public;
CREATE POLICY "Public reads safe settings"
ON public.site_settings_public
FOR SELECT
TO anon, authenticated
USING (true);

INSERT INTO public.site_settings_public (
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
)
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
WHERE id = 1
ON CONFLICT (id) DO UPDATE SET
  site_title = EXCLUDED.site_title,
  site_tagline = EXCLUDED.site_tagline,
  logo_url = EXCLUDED.logo_url,
  favicon_url = EXCLUDED.favicon_url,
  primary_color = EXCLUDED.primary_color,
  background_color = EXCLUDED.background_color,
  font_heading = EXCLUDED.font_heading,
  font_body = EXCLUDED.font_body,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description,
  seo_keywords = EXCLUDED.seo_keywords,
  social_facebook = EXCLUDED.social_facebook,
  social_twitter = EXCLUDED.social_twitter,
  social_youtube = EXCLUDED.social_youtube,
  social_github = EXCLUDED.social_github,
  social_website = EXCLUDED.social_website,
  updated_at = EXCLUDED.updated_at;

CREATE OR REPLACE FUNCTION public.sync_site_settings_public()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.site_settings_public (
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
  ) VALUES (
    NEW.id,
    NEW.site_title,
    NEW.site_tagline,
    NEW.logo_url,
    NEW.favicon_url,
    NEW.primary_color,
    NEW.background_color,
    NEW.font_heading,
    NEW.font_body,
    NEW.seo_title,
    NEW.seo_description,
    NEW.seo_keywords,
    NEW.social_facebook,
    NEW.social_twitter,
    NEW.social_youtube,
    NEW.social_github,
    NEW.social_website,
    NEW.updated_at
  )
  ON CONFLICT (id) DO UPDATE SET
    site_title = EXCLUDED.site_title,
    site_tagline = EXCLUDED.site_tagline,
    logo_url = EXCLUDED.logo_url,
    favicon_url = EXCLUDED.favicon_url,
    primary_color = EXCLUDED.primary_color,
    background_color = EXCLUDED.background_color,
    font_heading = EXCLUDED.font_heading,
    font_body = EXCLUDED.font_body,
    seo_title = EXCLUDED.seo_title,
    seo_description = EXCLUDED.seo_description,
    seo_keywords = EXCLUDED.seo_keywords,
    social_facebook = EXCLUDED.social_facebook,
    social_twitter = EXCLUDED.social_twitter,
    social_youtube = EXCLUDED.social_youtube,
    social_github = EXCLUDED.social_github,
    social_website = EXCLUDED.social_website,
    updated_at = EXCLUDED.updated_at;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS sync_site_settings_public_trigger ON public.site_settings;
CREATE TRIGGER sync_site_settings_public_trigger
AFTER INSERT OR UPDATE ON public.site_settings
FOR EACH ROW
EXECUTE FUNCTION public.sync_site_settings_public();