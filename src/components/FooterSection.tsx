import { Youtube, Facebook, Instagram, Linkedin, Github, Twitter, Mail, MapPin, Phone, Rss } from "lucide-react";
import { Link } from "react-router-dom";

const socials = [
  { icon: Facebook, href: "https://www.facebook.com/md.shinha.sarder", label: "Facebook" },
  { icon: Twitter, href: "https://x.com/mdshinhasarder", label: "X / Twitter" },
  { icon: Youtube, href: "https://www.youtube.com/@MD-Shinha-Sarder", label: "YouTube" },
  { icon: Instagram, href: "https://www.instagram.com/md_shinha_sarder", label: "Instagram" },
  { icon: Linkedin, href: "https://www.linkedin.com/in/md-shinha-sarder/", label: "LinkedIn" },
  { icon: Github, href: "https://github.com/md-shinha-sarder", label: "GitHub" },
];

const FooterSection = () => (
  <footer className="border-t border-border pt-16 pb-8 bg-gradient-to-b from-background to-card/50">
    <div className="container mx-auto px-6">
      <div className="grid md:grid-cols-3 gap-10 mb-12">
        <div>
          <h3 className="text-2xl font-serif font-bold text-gradient-gold mb-3">MD. Shinha Sarder</h3>
          <p className="text-sm text-muted-foreground text-justify leading-relaxed">
            Software Developer &amp; Entrepreneur. Founder of IT Tech BD and Biostar TV World.
          </p>
        </div>
        <div>
          <h4 className="font-serif font-semibold mb-4 text-foreground">Quick Links</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><a href="/#about" className="hover:text-primary transition-colors">Biography</a></li>
            <li><Link to="/posts" className="hover:text-primary transition-colors">All Posts</Link></li>
            <li><a href="/sitemap.xml" className="hover:text-primary transition-colors">Sitemap</a></li>
            <li><a href="/rss.xml" className="hover:text-primary transition-colors inline-flex items-center gap-1"><Rss size={12} /> RSS Feed</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-serif font-semibold mb-4 text-foreground">Contact</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2"><Phone size={14} className="text-primary" /> <a href="https://wa.me/8801576716992" className="hover:text-primary">+880 1576-716992</a></li>
            <li className="flex items-center gap-2"><Mail size={14} className="text-primary" /> <a href="mailto:Shinhasarder2343@gmail.com" className="hover:text-primary break-all">Shinhasarder2343@gmail.com</a></li>
            <li className="flex items-center gap-2"><MapPin size={14} className="text-primary" /> Khulna, Bangladesh</li>
          </ul>
        </div>
      </div>

      <div className="flex justify-center gap-3 mb-8 flex-wrap">
        {socials.map((s) => (
          <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}
            className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary hover:bg-primary/5 transition-all">
            <s.icon size={18} />
          </a>
        ))}
      </div>
      <div className="pt-6 border-t border-border text-center">
        <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} MD. Shinha Sarder. All Rights Reserved.</p>
      </div>
    </div>
  </footer>
);

export default FooterSection;
