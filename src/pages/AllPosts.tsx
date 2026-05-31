import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, Calendar, Search } from "lucide-react";
import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";
import { usePosts } from "@/hooks/usePosts";
import { postPath } from "@/lib/postUrl";

const fmt = (d: string) => { try { return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }); } catch { return ""; } };

const AllPosts = () => {
  const { posts, loading } = usePosts();
  const [q, setQ] = useState("");
  const [tag, setTag] = useState<string | null>(null);
  const allTags = useMemo(() => Array.from(new Set(posts.flatMap((p) => p.tags))).sort(), [posts]);
  const filtered = posts.filter((p) =>
    (!tag || p.tags.includes(tag)) &&
    (!q || p.title.toLowerCase().includes(q.toLowerCase()) || p.excerpt.toLowerCase().includes(q.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Helmet>
        <title>All Posts | MD. Shinha Sarder</title>
        <meta name="description" content="Browse all articles, biographies, projects and updates by MD. Shinha Sarder." />
        <link rel="canonical" href={typeof window !== "undefined" ? window.location.href : ""} />
      </Helmet>
      <Navbar />
      <section className="pt-32 pb-16">
        <div className="container mx-auto px-6">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6"><ArrowLeft size={16} /> Home</Link>
          <h1 className="text-4xl sm:text-5xl font-serif font-bold mb-3">All <span className="text-gradient-gold">Posts</span></h1>
          <p className="text-muted-foreground mb-8">{posts.length} articles</p>

          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search posts..." className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:border-primary" />
            </div>
            <div className="flex gap-2 flex-wrap">
              <button onClick={() => setTag(null)} className={`px-3 py-2 rounded-lg text-xs ${!tag ? "bg-primary text-primary-foreground" : "border border-border text-muted-foreground hover:text-primary"}`}>All</button>
              {allTags.map((t) => (
                <button key={t} onClick={() => setTag(t)} className={`px-3 py-2 rounded-lg text-xs ${tag === t ? "bg-primary text-primary-foreground" : "border border-border text-muted-foreground hover:text-primary"}`}>{t}</button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">{Array.from({ length: 9 }).map((_, i) => <div key={i} className="h-80 bg-card/50 animate-pulse rounded-xl border border-border" />)}</div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((p) => (
                <Link key={p.id} to={`/post/${p.slug}`} className="group bg-gradient-card rounded-xl overflow-hidden border border-border hover:border-primary/40 transition-all hover:-translate-y-1 duration-300 flex flex-col">
                  {p.image && <div className="aspect-[16/10] overflow-hidden bg-secondary"><img src={p.image} alt={p.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /></div>}
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex flex-wrap gap-2 mb-3">{p.tags.slice(0, 2).map((t) => <span key={t} className="text-[10px] uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-full">{t}</span>)}</div>
                    <h4 className="font-serif font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors">{p.title}</h4>
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-3 flex-1">{p.excerpt}</p>
                    <span className="text-xs text-muted-foreground flex items-center gap-1"><Calendar size={12} /> {fmt(p.published)}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
      <FooterSection />
    </div>
  );
};

export default AllPosts;
