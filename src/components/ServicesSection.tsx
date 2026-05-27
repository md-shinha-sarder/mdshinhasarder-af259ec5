import { Facebook, Instagram, MessageCircle, Palette, Youtube, Megaphone } from "lucide-react";

const services = [
  { icon: Facebook, title: "Facebook Page Management", desc: "Complete Facebook page setup, branding, content creation, scheduling and audience engagement to grow your brand presence." },
  { icon: Instagram, title: "Instagram Management", desc: "Instagram account strategy, content curation, story management, hashtag optimization and follower growth." },
  { icon: MessageCircle, title: "WhatsApp Business Handling", desc: "Professional WhatsApp Business setup, automated replies, catalog management and customer communication handling." },
  { icon: Palette, title: "Canva-Based Designs", desc: "Eye-catching thumbnails, logos, social media posts, banners and marketing collateral using Canva's design tools." },
  { icon: Youtube, title: "YouTube SEO & Strategy", desc: "Channel optimization, keyword research, video title/description SEO, thumbnail design and content strategy planning." },
  { icon: Megaphone, title: "Facebook Ads", desc: "Facebook advertising campaigns including ad creative, audience targeting and budget management to drive results." },
];

const ServicesSection = () => (
  <section id="services" className="py-24 bg-gradient-to-b from-transparent via-primary/5 to-transparent">
    <div className="container mx-auto px-6">
      <p className="text-center text-xs uppercase tracking-[0.3em] text-primary mb-3">Services</p>
      <h2 className="text-3xl sm:text-4xl font-serif font-bold text-center mb-3">
        What I <span className="text-gradient-gold">Offer</span>
      </h2>
      <p className="text-center text-muted-foreground mb-14">Digital marketing and social media services to grow your online presence.</p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((s) => (
          <div key={s.title} className="group bg-gradient-card border border-border rounded-2xl p-6 shadow-card hover:border-primary/50 transition-all hover:-translate-y-1">
            <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
              <s.icon className="text-primary" size={22} />
            </div>
            <h3 className="font-serif font-semibold text-lg mb-2 group-hover:text-primary transition-colors">{s.title}</h3>
            <p className="text-sm text-muted-foreground text-justify">{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default ServicesSection;
