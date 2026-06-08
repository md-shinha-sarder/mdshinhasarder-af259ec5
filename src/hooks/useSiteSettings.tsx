import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface SiteSettings {
  id: number;
  site_title: string | null;
  site_tagline: string | null;
  logo_url: string | null;
  favicon_url: string | null;
  primary_color: string | null;
  background_color: string | null;
  font_heading: string | null;
  font_body: string | null;
  seo_title: string | null;
  seo_description: string | null;
  seo_keywords: string | null;
  social_facebook: string | null;
  social_twitter: string | null;
  social_youtube: string | null;
  social_github: string | null;
  social_website: string | null;
  contact_email: string | null;
  contact_phone: string | null;
}

export const useSiteSettings = () => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("site_settings")
      .select("id, site_title, site_tagline, logo_url, favicon_url, primary_color, background_color, font_heading, font_body, seo_title, seo_description, seo_keywords, social_facebook, social_twitter, social_youtube, social_github, social_website, updated_at")
      .eq("id", 1)
      .maybeSingle()
      .then(({ data }) => {
        setSettings(data as unknown as SiteSettings);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!settings) return;
    const root = document.documentElement;
    if (settings.primary_color) root.style.setProperty("--primary", settings.primary_color);
    if (settings.background_color) root.style.setProperty("--background", settings.background_color);
    if (settings.seo_title) document.title = settings.seo_title;
    const meta = document.querySelector('meta[name="description"]');
    if (meta && settings.seo_description) meta.setAttribute("content", settings.seo_description);
  }, [settings]);

  return { settings, loading };
};
