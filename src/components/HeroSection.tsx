import { MapPin, Calendar, Mail, FileText, ExternalLink, BadgeCheck } from "lucide-react";
import heroPortrait from "@/assets/hero-portrait.jpg";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{ backgroundImage: `url(${heroBg})` }} />
      <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />

      <div className="relative z-10 container mx-auto px-6 pt-24 pb-16 flex flex-col lg:flex-row items-center gap-12">
        <div className="flex-1 text-center lg:text-left animate-fade-up">
          <p className="text-primary font-medium tracking-widest uppercase text-sm mb-4">Welcome</p>
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-serif font-bold leading-tight mb-6 flex flex-wrap items-center justify-center lg:justify-start gap-3">
            <span>MD. Shinha <span className="text-gradient-gold">Sarder</span></span>
            <span title="Verified" className="inline-flex items-center justify-center">
              <BadgeCheck className="w-8 h-8 sm:w-10 sm:h-10 text-primary fill-primary/20" aria-label="Verified" />
            </span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-xl">
            Software Developer · Entrepreneur · Musical Artist · Author · Researcher
          </p>

          <div className="flex flex-wrap gap-4 justify-center lg:justify-start text-sm text-muted-foreground mb-8">
            <span className="flex items-center gap-1.5"><Calendar size={14} className="text-primary" /> Nov 05, 2004</span>
            <span className="flex items-center gap-1.5"><MapPin size={14} className="text-primary" /> Khulna, Bangladesh</span>
          </div>

          <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
            <a href="mailto:contact@shinhasarder.com" className="inline-flex items-center gap-2 bg-gradient-gold text-primary-foreground px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity shadow-gold">
              <Mail size={16} /> Email Me
            </a>
            <a href="https://drive.google.com/file/d/1b4uAYCgzzgpprCkI16KYS2ycPk1VBEXk/view" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-primary/40 px-6 py-3 rounded-lg text-foreground hover:bg-primary/10 hover:text-primary transition-colors">
              <FileText size={16} /> Preview CV
            </a>
            <a href="https://share.google/8cHEzvrnE2uFpnlc3" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-border px-6 py-3 rounded-lg text-foreground hover:border-primary hover:text-primary transition-colors">
              <ExternalLink size={16} /> Google Panel
            </a>
          </div>
        </div>

        <div className="flex-shrink-0 animate-fade-in">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-gold rounded-full opacity-30 blur-xl animate-pulse-glow" />
            <img src={heroPortrait} alt="MD. Shinha Sarder" width={320} height={400}
              className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-full object-cover border-4 border-primary/30" />
            <span title="Verified" className="absolute bottom-4 right-4 bg-background rounded-full p-1 border-2 border-primary shadow-gold">
              <BadgeCheck className="w-7 h-7 text-primary fill-primary/30" />
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
