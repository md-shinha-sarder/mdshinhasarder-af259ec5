import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { LayoutDashboard, FileText, Newspaper, Image, Settings, Palette, LogOut, Home, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

const items = [
  { to: "/admin", icon: LayoutDashboard, label: "Dashboard", end: true },
  { to: "/admin/pages", icon: FileText, label: "Pages" },
  { to: "/admin/posts", icon: Newspaper, label: "Posts" },
  { to: "/admin/media", icon: Image, label: "Media" },
  { to: "/admin/news-check", icon: ShieldCheck, label: "News Eligibility" },
  { to: "/admin/seo", icon: Settings, label: "SEO Settings" },
  { to: "/admin/theme", icon: Palette, label: "Theme" },
];

const AdminLayout = () => {
  const { user, isAdmin, loading, signOut } = useAuth();
  const nav = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (!user) { nav("/auth"); return; }
    if (!isAdmin) {
      signOut().then(() => {
        import("sonner").then(({ toast }) => toast.error("Admin access required."));
        nav("/auth");
      });
    }
  }, [user, isAdmin, loading, nav, signOut]);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading...</div>;
  if (!user || !isAdmin) return null;


  return (
    <div className="min-h-screen flex bg-background text-foreground">
      <aside className="w-60 border-r border-border bg-card/50 flex flex-col">
        <div className="p-5 border-b border-border">
          <h2 className="font-serif font-bold text-lg text-gradient-gold">Admin Panel</h2>
          <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {items.map((i) => (
            <NavLink key={i.to} to={i.to} end={i.end} className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${isActive ? "bg-primary/15 text-primary" : "text-muted-foreground hover:bg-secondary hover:text-foreground"}`
            }>
              <i.icon size={16} /> {i.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-3 border-t border-border space-y-1">
          <NavLink to="/" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-secondary hover:text-foreground">
            <Home size={16} /> View Site
          </NavLink>
          <button onClick={() => signOut().then(() => nav("/auth"))} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-secondary hover:text-foreground">
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto"><div className="p-8 max-w-6xl mx-auto"><Outlet /></div></main>
    </div>
  );
};

export default AdminLayout;
