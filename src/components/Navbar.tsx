import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Search, BadgeCheck, Home, User, Wrench, FolderKanban, Sparkles, Images, Music, BookOpen, Newspaper } from "lucide-react";
import siteLogo from "@/assets/site-logo.ico";

const navLinks = [
  { label: "Home", href: "#home", icon: Home },
  { label: "Biography", href: "#about", icon: User },
  { label: "Skills", href: "#skills", icon: Wrench },
  { label: "Projects", href: "#projects", icon: FolderKanban },
  { label: "Services", href: "#services", icon: Sparkles },
  { label: "Gallery", href: "#gallery", icon: Images },
  { label: "Music", href: "#music", icon: Music },
  { label: "Books", href: "#books", icon: BookOpen },
  { label: "Blog", href: "#blog", icon: Newspaper },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [q, setQ] = useState("");
  const { pathname } = useLocation();
  const nav = useNavigate();
  const onHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const linkHref = (href: string) => (onHome ? href : `/${href}`);

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (q.trim()) {
      nav(`/posts?q=${encodeURIComponent(q.trim())}`);
      setSearchOpen(false);
      setOpen(false);
    }
  };

  const Brand = (
    <Link to="/" className="flex items-center gap-1.5 min-w-0" onClick={() => setOpen(false)}>
      <img src={siteLogo} alt="MD. Shinha Sarder logo" className="w-7 h-7 rounded-full object-cover shadow-gold flex-shrink-0" />
      <span className="text-xs sm:text-sm font-serif font-bold text-gradient-gold tracking-tight whitespace-nowrap">MD. Shinha Sarder</span>
      <BadgeCheck className="w-3.5 h-3.5 text-primary fill-primary/20 flex-shrink-0" aria-label="Verified" />
    </Link>
  );

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "glass-card shadow-card" : "bg-background/40 backdrop-blur-sm"}`}>
        <div className="container mx-auto px-4 sm:px-6 py-3">
          <div className="grid grid-cols-[auto_1fr_auto] items-center gap-2 lg:hidden">
            <button onClick={() => setOpen(!open)} className="text-foreground p-1.5 hover:text-primary transition-colors" aria-label="Toggle menu">
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
            <div className="flex justify-center min-w-0">
              {searchOpen ? (
                <form onSubmit={onSearch} className="w-full max-w-md">
                  <div className="relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search site..." aria-label="Search site"
                      className="w-full pl-9 pr-3 py-2 text-xs bg-card/80 border border-border rounded-full focus:outline-none focus:border-primary" />
                  </div>
                </form>
              ) : Brand}
            </div>
            <button onClick={() => setSearchOpen(!searchOpen)} className="text-foreground p-1.5 hover:text-primary transition-colors" aria-label="Toggle search">
              {searchOpen ? <X size={20} /> : <Search size={20} />}
            </button>
          </div>

          <div className="hidden lg:flex items-center justify-between gap-4">
            {Brand}
            <ul className="flex items-center gap-0.5">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <a href={linkHref(l.href)} className="group flex items-center gap-1.5 px-3 py-2 text-[13px] text-muted-foreground hover:text-primary rounded-md hover:bg-primary/5 transition-colors">
                    <l.icon size={14} className="opacity-70 group-hover:opacity-100" />
                    <span>{l.label}</span>
                  </a>
                </li>
              ))}
            </ul>
            <div className="flex items-center gap-2">
              {searchOpen ? (
                <form onSubmit={onSearch}>
                  <div className="relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search..." aria-label="Search site"
                      className="w-56 pl-9 pr-3 py-2 text-xs bg-card/80 border border-border rounded-full focus:outline-none focus:border-primary" />
                  </div>
                </form>
              ) : null}
              <button onClick={() => setSearchOpen(!searchOpen)} className="text-foreground p-1.5 hover:text-primary transition-colors" aria-label="Toggle search">
                {searchOpen ? <X size={18} /> : <Search size={18} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className={`fixed inset-0 z-40 bg-background/70 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${open ? "opacity-100" : "opacity-0 pointer-events-none"}`} onClick={() => setOpen(false)} />
      <aside className={`fixed top-0 left-0 bottom-0 z-50 w-72 max-w-[85vw] glass-card border-r border-border shadow-card transition-transform duration-300 lg:hidden ${open ? "translate-x-0" : "-translate-x-full"}`} aria-hidden={!open}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <span className="text-sm font-serif font-bold text-gradient-gold">Menu</span>
          <button onClick={() => setOpen(false)} className="text-foreground hover:text-primary" aria-label="Close menu"><X size={20} /></button>
        </div>
        <nav className="flex flex-col py-3">
          {navLinks.map((l) => (
            <a key={l.href} href={linkHref(l.href)} onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-6 py-3 text-sm text-muted-foreground hover:text-primary hover:bg-primary/5 border-l-2 border-transparent hover:border-primary transition-all">
              <l.icon size={16} className="text-primary/70" />
              <span>{l.label}</span>
            </a>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Navbar;
