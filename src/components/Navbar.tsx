import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Search, BadgeCheck } from "lucide-react";
import siteLogo from "@/assets/site-logo.ico";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Biography", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Services", href: "#services" },
  { label: "Gallery", href: "#gallery" },
  { label: "Music", href: "#music" },
  { label: "Books", href: "#books" },
  { label: "Blog", href: "#blog" },
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
    <Link to="/" className="flex items-center gap-2">
      <img src={siteLogo} alt="MD. Shinha Sarder logo" className="w-9 h-9 rounded-full object-cover shadow-gold" />
      <span className="text-base sm:text-lg font-serif font-bold text-gradient-gold tracking-tight whitespace-nowrap">MD. Shinha Sarder</span>
      <BadgeCheck className="w-4 h-4 text-primary fill-primary/20" aria-label="Verified" />
    </Link>
  );

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "glass-card shadow-card" : "bg-background/40 backdrop-blur-sm"}`}>
      <div className="container mx-auto px-6 py-3">
        <div className="hidden lg:flex items-center justify-between gap-6">
          <div className="flex items-center gap-5 min-w-0">
            {Brand}
            <div className="flex items-center gap-4 ml-4">
              {navLinks.map((l) => (
                <a key={l.href} href={linkHref(l.href)} className="text-xs text-muted-foreground hover:text-primary transition-colors relative after:absolute after:left-0 after:bottom-0 after:h-px after:w-0 after:bg-primary after:transition-all hover:after:w-full">
                  {l.label}
                </a>
              ))}
            </div>
          </div>
          <form onSubmit={onSearch} className="flex">
            <div className="relative w-[240px]">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search site..."
                aria-label="Search site"
                className="w-full pl-9 pr-3 py-2 text-xs bg-card/60 border border-border rounded-full focus:outline-none focus:border-primary"
              />
            </div>
          </form>
        </div>

        <div className="lg:hidden grid grid-cols-3 items-center">
          <button onClick={() => setOpen(!open)} className="text-foreground justify-self-start" aria-label="Toggle menu">
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
          <div className="justify-self-center">{Brand}</div>
          <button onClick={() => setSearchOpen(!searchOpen)} className="text-foreground justify-self-end" aria-label="Toggle search">
            {searchOpen ? <X size={20} /> : <Search size={20} />}
          </button>
        </div>
      </div>

      {searchOpen && (
        <div className="lg:hidden glass-card border-t border-border px-6 py-3">
          <form onSubmit={onSearch}>
            <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search site..." className="w-full px-3 py-2 text-sm bg-card border border-border rounded-lg focus:outline-none focus:border-primary" />
          </form>
        </div>
      )}

      {open && (
        <div className="lg:hidden glass-card border-t border-border px-6 pb-4">
          {navLinks.map((l) => (
            <a key={l.href} href={linkHref(l.href)} onClick={() => setOpen(false)} className="block py-2 text-sm text-muted-foreground hover:text-primary transition-colors">
              {l.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
