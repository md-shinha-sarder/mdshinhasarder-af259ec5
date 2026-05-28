import { MapPin, Calendar, Mail, FileText, ExternalLink, BadgeCheck, ArrowDown, Briefcase, Phone, Globe } from "lucide-react";
import profilePhoto from "@/assets/profile-photo.webp";
import heroBg from "@/assets/hero-bg.jpg";

const info = [
  { icon: Calendar, label: "Born", value: "5 November 2004" },
  { icon: MapPin, label: "Place", value: "Khulna, Bangladesh" },
  { icon: Briefcase, label: "Profession", value: "Entrepreneur" },
  { icon: Globe, label: "Website", value: "mdshinhasarder.com", href: "https://mdshinhasarder.com" },
  { icon: Mail, label: "Email", value: "Shinhasarder2343@gmail.com", href: "mailto:Shinhasarder2343@gmail.com" },
  { icon: Phone, label: "WhatsApp", value: "+880 1576-716992", href: "https://wa.me/8801576716992" },
  { icon: FileText, label: "Curriculum Vitae", value: "Preview CV", href: "https://drive.google.com/file/d/1b4uAYCgzzgpprCkI16KYS2ycPk1VBEXk/view" },
  { icon: ExternalLink, label: "Google Panel", value: "Knowledge Panel", href: "https://share.google/8cHEzvrnE2uFpnlc3" },
];

const HeroSection = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{ backgroundImage: `url(${heroBg})` }} />
      <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
      <div className="absolute top-1/3 -left-32 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />

      <div className="relative z-10 container mx-auto px-6 pt-28 pb-16">
        <div className="text-center mb-8 animate-fade-up">
          <span className="inline-flex items-center gap-2 text-[10px] text-primary font-medium tracking-widest uppercase mb-4 px-3 py-1 rounded-full border border-primary/30 bg-primary/5">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" /> Welcome to My Website
          </span>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold leading-tight mb-2 flex flex-wrap items-center justify-center gap-2">
            <span>MD. Shinha <span className="text-gradient-gold">Sarder</span></span>
            <BadgeCheck className="w-5 h-5 sm:w-6 sm:h-6 text-primary fill-primary/20" aria-label="Verified" />
          </h1>
          <p className="text-sm uppercase tracking-[0.25em] text-primary">Entrepreneur</p>
        </div>

        <div className="rounded-2xl border border-border bg-gradient-card shadow-card overflow-hidden animate-fade-in">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-72 flex-shrink-0 p-6 flex items-center justify-center bg-card/40 border-b md:border-b-0 md:border-r border-border">
              <div className="relative">
                <div className="absolute -inset-2 bg-gradient-gold rounded-full opacity-30 blur-2xl animate-pulse-glow" />
                <div className="absolute -inset-0.5 bg-gradient-gold rounded-full opacity-60" />
                <img src={profilePhoto} alt="MD. Shinha Sarder portrait" width={240} height={240}
                  className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-full object-cover border-4 border-background" />
                <span title="Verified" className="absolute bottom-3 right-3 bg-background rounded-full p-1.5 border-2 border-primary shadow-gold">
                  <BadgeCheck className="w-5 h-5 text-primary fill-primary/30" />
                </span>
              </div>
            </div>

            <div className="flex-1">
              <table className="w-full text-sm">
                <tbody>
                  {info.map((row) => (
                    <tr key={row.label} className="border-b border-border/60 last:border-0 hover:bg-primary/5 transition-colors">
                      <td className="py-2.5 px-4 w-[42%] sm:w-[34%] text-muted-foreground align-top">
                        <span className="inline-flex items-center gap-2">
                          <row.icon size={14} className="text-primary" /> {row.label}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 text-foreground/90 text-justify">
                        {row.href ? (
                          <a href={row.href} target={row.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className="hover:text-primary transition-colors break-all">
                            {row.value}
                          </a>
                        ) : (
                          row.value
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mt-6 justify-center">
          <a href="mailto:Shinhasarder2343@gmail.com" className="inline-flex items-center gap-2 bg-gradient-gold text-primary-foreground px-5 py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity shadow-gold">
            <Mail size={14} /> Email Me
          </a>
          <a href="https://drive.google.com/file/d/1b4uAYCgzzgpprCkI16KYS2ycPk1VBEXk/view" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border border-primary/40 px-5 py-2.5 rounded-lg text-sm text-foreground hover:bg-primary/10 hover:text-primary transition-colors">
            <FileText size={14} /> Preview CV
          </a>
          <a href="https://share.google/8cHEzvrnE2uFpnlc3" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border border-border px-5 py-2.5 rounded-lg text-sm text-foreground hover:border-primary hover:text-primary transition-colors">
            <ExternalLink size={14} /> Google Panel
          </a>
        </div>
      </div>

      <a href="#about" aria-label="Scroll down" className="absolute bottom-6 left-1/2 -translate-x-1/2 text-muted-foreground hover:text-primary transition-colors animate-bounce">
        <ArrowDown size={22} />
      </a>
    </section>
  );
};

export default HeroSection;
