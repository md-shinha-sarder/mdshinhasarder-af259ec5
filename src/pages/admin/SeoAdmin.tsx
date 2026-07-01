import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { MediaPicker } from "@/components/admin/MediaPicker";
import { toSiteMediaUrl } from "@/lib/mediaUrl";

const SeoAdmin = () => {
  const [s, setS] = useState<any>(null);
  const [contact, setContact] = useState<{ contact_email: string; contact_phone: string }>({
    contact_email: "",
    contact_phone: "",
  });

  useEffect(() => {
    supabase.from("site_settings").select("*").eq("id", 1).maybeSingle().then(({ data }) => setS(data));
    (supabase.from as any)("site_contact")
      .select("contact_email, contact_phone")
      .eq("id", 1)
      .maybeSingle()
      .then(({ data }: any) => {
        if (data) setContact({ contact_email: data.contact_email || "", contact_phone: data.contact_phone || "" });
      });
  }, []);

  const save = async () => {
    const { error } = await supabase.from("site_settings").update({
      site_title: s.site_title, site_tagline: s.site_tagline,
      logo_url: s.logo_url, favicon_url: s.favicon_url,
      seo_title: s.seo_title, seo_description: s.seo_description, seo_keywords: s.seo_keywords,
      social_facebook: s.social_facebook, social_twitter: s.social_twitter, social_youtube: s.social_youtube,
      social_github: s.social_github, social_website: s.social_website,
    }).eq("id", 1);
    if (error) return toast.error(error.message);

    const { error: cErr } = await (supabase.from as any)("site_contact").upsert({
      id: 1,
      contact_email: contact.contact_email || null,
      contact_phone: contact.contact_phone || null,
    });
    if (cErr) return toast.error(cErr.message);

    toast.success("Saved");
  };

  if (!s) return <div className="text-muted-foreground">Loading...</div>;

  return (
    <div className="space-y-6 max-w-2xl">
      <div><h1 className="text-2xl sm:text-3xl font-serif font-bold">SEO & Social</h1><p className="text-muted-foreground">Site branding, default meta tags, and social links.</p></div>
      <div className="bg-gradient-card border border-border rounded-xl p-4 sm:p-6 space-y-4">
        <div className="grid sm:grid-cols-2 gap-3">
          <div><Label>Site Title</Label><Input value={s.site_title || ""} onChange={(e) => setS({ ...s, site_title: e.target.value })} /></div>
          <div><Label>Tagline</Label><Input value={s.site_tagline || ""} onChange={(e) => setS({ ...s, site_tagline: e.target.value })} /></div>
        </div>
        <MediaPicker label="Site Logo" value={toSiteMediaUrl(s.logo_url || "")} onChange={(url) => setS({ ...s, logo_url: url })} />
        <MediaPicker label="Favicon" value={toSiteMediaUrl(s.favicon_url || "")} onChange={(url) => setS({ ...s, favicon_url: url })} />
        <div><Label>SEO Title</Label><Input value={s.seo_title || ""} onChange={(e) => setS({ ...s, seo_title: e.target.value })} /></div>
        <div><Label>SEO Description</Label><Textarea rows={3} value={s.seo_description || ""} onChange={(e) => setS({ ...s, seo_description: e.target.value })} /></div>
        <div><Label>Keywords</Label><Input value={s.seo_keywords || ""} onChange={(e) => setS({ ...s, seo_keywords: e.target.value })} /></div>
        <div className="grid grid-cols-2 gap-3">
          <div><Label>Contact Email (admin-only)</Label><Input value={contact.contact_email} onChange={(e) => setContact({ ...contact, contact_email: e.target.value })} /></div>
          <div><Label>Contact Phone (admin-only)</Label><Input value={contact.contact_phone} onChange={(e) => setContact({ ...contact, contact_phone: e.target.value })} /></div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div><Label>Facebook</Label><Input value={s.social_facebook || ""} onChange={(e) => setS({ ...s, social_facebook: e.target.value })} /></div>
          <div><Label>Twitter / X</Label><Input value={s.social_twitter || ""} onChange={(e) => setS({ ...s, social_twitter: e.target.value })} /></div>
          <div><Label>YouTube</Label><Input value={s.social_youtube || ""} onChange={(e) => setS({ ...s, social_youtube: e.target.value })} /></div>
          <div><Label>GitHub</Label><Input value={s.social_github || ""} onChange={(e) => setS({ ...s, social_github: e.target.value })} /></div>
          <div className="col-span-2"><Label>Website</Label><Input value={s.social_website || ""} onChange={(e) => setS({ ...s, social_website: e.target.value })} /></div>
        </div>
        <Button onClick={save} className="bg-gradient-gold text-primary-foreground">Save Settings</Button>
      </div>
    </div>
  );
};

export default SeoAdmin;
