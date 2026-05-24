import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const ThemeAdmin = () => {
  const [s, setS] = useState<any>(null);

  useEffect(() => {
    supabase.from("site_settings").select("*").eq("id", 1).maybeSingle().then(({ data }) => setS(data));
  }, []);

  const save = async () => {
    const { error } = await supabase.from("site_settings").update({
      site_title: s.site_title, site_tagline: s.site_tagline, logo_url: s.logo_url, favicon_url: s.favicon_url,
      primary_color: s.primary_color, background_color: s.background_color,
      font_heading: s.font_heading, font_body: s.font_body,
    }).eq("id", 1);
    if (error) return toast.error(error.message);
    toast.success("Saved. Reload site to see all changes.");
    if (s.primary_color) document.documentElement.style.setProperty("--primary", s.primary_color);
    if (s.background_color) document.documentElement.style.setProperty("--background", s.background_color);
  };

  if (!s) return <div className="text-muted-foreground">Loading...</div>;

  return (
    <div className="space-y-6 max-w-2xl">
      <div><h1 className="text-3xl font-serif font-bold">Theme & Branding</h1><p className="text-muted-foreground">Customize site identity, colors, and fonts.</p></div>
      <div className="bg-gradient-card border border-border rounded-xl p-6 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div><Label>Site Title</Label><Input value={s.site_title || ""} onChange={(e) => setS({ ...s, site_title: e.target.value })} /></div>
          <div><Label>Tagline</Label><Input value={s.site_tagline || ""} onChange={(e) => setS({ ...s, site_tagline: e.target.value })} /></div>
        </div>
        <div><Label>Logo URL</Label><Input value={s.logo_url || ""} onChange={(e) => setS({ ...s, logo_url: e.target.value })} /></div>
        <div><Label>Favicon URL</Label><Input value={s.favicon_url || ""} onChange={(e) => setS({ ...s, favicon_url: e.target.value })} /></div>
        <div className="grid grid-cols-2 gap-3">
          <div><Label>Primary Color (HSL)</Label><Input placeholder="42 87% 55%" value={s.primary_color || ""} onChange={(e) => setS({ ...s, primary_color: e.target.value })} /></div>
          <div><Label>Background Color (HSL)</Label><Input placeholder="222 47% 6%" value={s.background_color || ""} onChange={(e) => setS({ ...s, background_color: e.target.value })} /></div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div><Label>Heading Font</Label><Input value={s.font_heading || ""} onChange={(e) => setS({ ...s, font_heading: e.target.value })} /></div>
          <div><Label>Body Font</Label><Input value={s.font_body || ""} onChange={(e) => setS({ ...s, font_body: e.target.value })} /></div>
        </div>
        <p className="text-xs text-muted-foreground">Tip: HSL format is three space-separated values, e.g. <code>42 87% 55%</code>.</p>
        <Button onClick={save} className="bg-gradient-gold text-primary-foreground">Save Theme</Button>
      </div>
    </div>
  );
};

export default ThemeAdmin;
