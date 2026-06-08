import { useMemo, useState } from "react";
import { X } from "lucide-react";
import { usePosts } from "@/hooks/usePosts";
import { buildAlt } from "@/lib/imageSeo";

const GallerySection = () => {
  const { posts, loading } = usePosts();
  const [open, setOpen] = useState<string | null>(null);

  const images = useMemo(() => {
    const set = new Set<string>();
    const out: { src: string; title: string; tags: string[]; idx: number }[] = [];
    posts.forEach((p) => {
      const found = new Set<string>();
      if (p.image) found.add(p.image);
      const re = /<img[^>]+src=["']([^"']+)["']/gi;
      let m;
      while ((m = re.exec(p.content)) !== null) found.add(m[1]);
      let i = 0;
      found.forEach((src) => {
        i += 1;
        if (!set.has(src)) {
          set.add(src);
          out.push({ src, title: p.title, tags: p.tags || [], idx: i });
        }
      });
    });
    return out;
  }, [posts]);

  return (
    <section id="gallery" className="py-24">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl sm:text-4xl font-serif font-bold text-center mb-3">
          Photo <span className="text-gradient-gold">Gallery</span>
        </h2>
        <p className="text-center text-muted-foreground mb-12">Moments captured from articles, events and projects.</p>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {Array.from({ length: 8 }).map((_, i) => <div key={i} className="aspect-square rounded-xl bg-card/50 animate-pulse" />)}
          </div>
        ) : images.length === 0 ? (
          <p className="text-center text-muted-foreground">No photos yet.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {images.slice(0, 24).map((img, i) => (
              <button key={i} onClick={() => setOpen(img.src)} className="group relative aspect-square overflow-hidden rounded-xl border border-border hover:border-primary/60 transition-colors">
                <img src={img.src} alt={buildAlt(img.title, [...img.tags, `photo ${img.idx}`])} width={800} height={800} loading="lazy" decoding="async" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <span className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                  <span className="text-xs text-foreground line-clamp-2">{img.title}</span>
                </span>
              </button>
            ))}
          </div>
        )}

        {open && (
          <div onClick={() => setOpen(null)} className="fixed inset-0 z-[70] bg-background/90 backdrop-blur-sm flex items-center justify-center p-6 animate-fade-in">
            <button onClick={() => setOpen(null)} aria-label="Close" className="absolute top-6 right-6 w-10 h-10 rounded-full border border-border bg-card flex items-center justify-center hover:text-primary hover:border-primary">
              <X size={18} />
            </button>
            <img src={open} alt="Photo by MD. Shinha Sarder" loading="eager" decoding="async" className="max-w-full max-h-full rounded-xl shadow-card" />
          </div>
        )}
      </div>
    </section>
  );
};

export default GallerySection;
