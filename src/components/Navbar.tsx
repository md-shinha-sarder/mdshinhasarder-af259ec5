import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Biography", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Music", href: "#music" },
  { label: "Books", href: "#books" },
  { label: "Publications", href: "#publications" },
  { label: "Blog", href: "#blog" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();
  const onHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const linkHref = (href: string) => (onHome ? href : `/${href}`);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "glass-card shadow-card" : "bg-background/40 backdrop-blur-sm"}`}>
      <div className="container mx-auto flex items-center justify-between px-6 py-3">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="w-9 h-9 rounded-full bg-gradient-gold flex items-center justify-center text-primary-foreground font-serif font-bold shadow-gold">S</span>
          <span className="text-base sm:text-lg font-serif font-bold text-gradient-gold tracking-tight">MD. Shinha Sarder</span>
        </Link>

        <div className="hidden lg:flex items-center gap-7">
          {navLinks.map((l) => (
            <a key={l.href} href={linkHref(l.href)} className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300 relative after:absolute after:left-0 after:bottom-0 after:h-px after:w-0 after:bg-primary after:transition-all hover:after:w-full">
              {l.label}
            </a>
          ))}
        </div>

        <button onClick={() => setOpen(!open)} className="lg:hidden text-foreground" aria-label="Toggle menu">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

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
