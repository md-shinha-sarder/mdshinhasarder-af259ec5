import { Music, Disc } from "lucide-react";

const singles = [
  "No Stars Heard Our Pain",
  "Fading Love in Quiet Shadows",
  "Lost Between Love and Pride",
  "Love Whispered but You Left",
  "Pagol Mon Kra",
];

const MusicSection = () => (
  <section id="music" className="py-24">
    <div className="container mx-auto px-6 max-w-3xl">
      <h2 className="text-3xl sm:text-4xl font-serif font-bold text-center mb-16">
        Albums & <span className="text-gradient-gold">Singles</span>
      </h2>

      <div className="space-y-4">
        {singles.map((s) => (
          <div
            key={s}
            className="flex items-center gap-4 bg-gradient-card rounded-xl p-5 border border-border hover:border-primary/40 transition-all group"
          >
            <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center group-hover:bg-primary/10 transition-colors">
              <Disc size={20} className="text-primary" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-foreground">{s}</h4>
              <p className="text-xs text-muted-foreground">Single · 2025</p>
            </div>
            <Music size={16} className="text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default MusicSection;
