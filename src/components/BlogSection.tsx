import { ArrowRight, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { usePosts } from "@/hooks/usePosts";
import { postPath } from "@/lib/postUrl";

const fmt = (d: string) => {
  try { return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }); }
  catch { return ""; }
};

const BlogSection = () => {
  const { posts, loading } = usePosts();
  const items = posts.slice(0, 9);
  return (
    <section id="blog" className="py-24">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl sm:text-4xl font-serif font-bold text-center mb-3">
          Latest <span className="text-gradient-gold">Posts</span>
        </h2>
        <p className="text-center text-muted-foreground mb-12">{posts.length > 0 ? `${posts.length} articles published` : "Stories, projects & updates"}</p>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-80 rounded-xl bg-card/50 animate-pulse border border-border" />
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((p) => (
              <Link
                key={p.id}
                to={`/post/${p.slug}`}
                className="group bg-gradient-card rounded-xl overflow-hidden border border-border hover:border-primary/40 transition-all hover:-translate-y-1 duration-300 flex flex-col"
              >
                {p.image && (
                  <div className="aspect-[16/10] overflow-hidden bg-secondary">
                    <img src={p.image} alt={p.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                )}
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {p.tags.slice(0, 2).map((t) => (
                      <span key={t} className="text-[10px] uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-full font-medium">{t}</span>
                    ))}
                  </div>
                  <h4 className="font-serif font-semibold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">{p.title}</h4>
                  <p className="text-xs text-muted-foreground mb-4 line-clamp-2 flex-1 text-justify">{p.excerpt}</p>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-xs text-muted-foreground flex items-center gap-1"><Calendar size={12} /> {fmt(p.published)}</span>
                    <ArrowRight size={14} className="text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {posts.length > 9 && (
          <div className="text-center mt-12">
            <Link to="/posts" className="inline-flex items-center gap-2 border border-border px-6 py-3 rounded-lg text-foreground hover:border-primary hover:text-primary transition-colors">
              View all {posts.length} posts <ArrowRight size={16} />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default BlogSection;
