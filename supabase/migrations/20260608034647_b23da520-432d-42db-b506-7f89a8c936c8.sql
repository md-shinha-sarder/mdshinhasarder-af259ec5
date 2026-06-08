-- Revoke contact column access from anon; authenticated (incl. admin) keeps access.
REVOKE SELECT ON public.site_settings FROM anon;
GRANT SELECT (id, site_title, site_tagline, logo_url, favicon_url,
              primary_color, background_color, font_heading, font_body,
              seo_title, seo_description, seo_keywords,
              social_facebook, social_twitter, social_youtube,
              social_github, social_website, updated_at)
ON public.site_settings TO anon;