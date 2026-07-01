import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { LayoutDashboard, FileText, Newspaper, Image, Settings, Palette, LogOut, Home, ShieldCheck, Menu, X } from "lucide-react";

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
  const [drawer, setDrawer] = useState(false);

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

  const Sidebar = (
    <>
      <div className="p-5 border-b border-border">
        <h2 className="font-serif font-bold text-lg text-gradient-gold">Admin Panel</h2>
        <p className="text-xs text-muted-foreground truncate">Signed in</p>
      </div>
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {items.map((i) => (
          <NavLink key={i.to} to={i.to} end={i.end} onClick={() => setDrawer(false)} className={({ isActive }) =>
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
    </>
  );

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      <aside className="hidden md:flex w-60 border-r border-border bg-card/50 flex-col shrink-0">{Sidebar}</aside>

      {drawer && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/60" onClick={() => setDrawer(false)} />
          <aside className="relative w-64 max-w-[80vw] bg-card border-r border-border flex flex-col">{Sidebar}</aside>
        </div>
      )}

      <main className="flex-1 min-w-0 overflow-auto">
        <div className="md:hidden sticky top-0 z-40 flex items-center justify-between p-3 border-b border-border bg-card/80 backdrop-blur">
          <button onClick={() => setDrawer(true)} className="p-2 rounded-lg hover:bg-secondary" aria-label="Menu">
            {drawer ? <X size={18} /> : <Menu size={18} />}
          </button>
          <span className="font-serif font-bold text-gradient-gold">Admin</span>
          <span className="w-8" />
        </div>
        <div className="p-4 sm:p-6 md:p-8 max-w-6xl mx-auto"><Outlet /></div>
      </main>
    </div>
  );
};

export default AdminLayout;
