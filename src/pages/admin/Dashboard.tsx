import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { FileText, Newspaper, Image } from "lucide-react";

const Dashboard = () => {
  const [stats, setStats] = useState({ pages: 0, posts: 0, media: 0 });
  useEffect(() => {
    (async () => {
      const [p, po, m] = await Promise.all([
        supabase.from("pages").select("*", { count: "exact", head: true }),
        supabase.from("posts").select("*", { count: "exact", head: true }),
        supabase.from("media").select("*", { count: "exact", head: true }),
      ]);
      setStats({ pages: p.count || 0, posts: po.count || 0, media: m.count || 0 });
    })();
  }, []);

  const cards = [
    { label: "Pages", value: stats.pages, icon: FileText },
    { label: "Posts", value: stats.posts, icon: Newspaper },
    { label: "Media", value: stats.media, icon: Image },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-serif font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Manage your site content, media, SEO, and theme.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="bg-gradient-card border border-border rounded-xl p-6 shadow-card">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">{c.label}</span>
              <c.icon size={18} className="text-primary" />
            </div>
            <div className="text-3xl font-bold">{c.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
