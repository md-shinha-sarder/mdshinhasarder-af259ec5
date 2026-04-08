import { Youtube, Facebook, Instagram, Linkedin, Github } from "lucide-react";

const socials = [
  { icon: Youtube, href: "#" },
  { icon: Facebook, href: "#" },
  { icon: Instagram, href: "#" },
  { icon: Linkedin, href: "#" },
  { icon: Github, href: "#" },
];

const FooterSection = () => (
  <footer className="border-t border-border py-12">
    <div className="container mx-auto px-6 text-center">
      <h3 className="text-2xl font-serif font-bold text-gradient-gold mb-4">
        MD. Shinha Sarder
      </h3>
      <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6">
        Software Developer & Entrepreneur · Founder of IT Tech BD and Biostar TV World
      </p>

      <div className="flex justify-center gap-4 mb-8">
        {socials.map((s, i) => (
          <a
            key={i}
            href={s.href}
            className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors"
          >
            <s.icon size={18} />
          </a>
        ))}
      </div>

      <p className="text-xs text-muted-foreground">
        © MD. Shinha Sarder. All Rights Reserved 2026
      </p>
    </div>
  </footer>
);

export default FooterSection;
