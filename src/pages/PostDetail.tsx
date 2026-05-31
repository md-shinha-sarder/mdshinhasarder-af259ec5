import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, Calendar, Facebook, Twitter, Linkedin, Link as LinkIcon, MessageCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";
import { usePosts } from "@/hooks/usePosts";
import { postPath } from "@/lib/postUrl";
import { toast } from "sonner";

const fmt = (d: string) => { try { return new Date(d).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }); } catch { return ""; } };

const PostDetail = () => {
  const params = useParams();
  const rawSlug = (params.slug || "").replace(/\.html?$/, "");
  const { posts, loading } = usePosts();
  const post = posts.find((p) => p.slug === rawSlug);
  const slug = rawSlug;
  const url = typeof window !== "undefined" ? window.location.href : "";
  const related = posts.filter((p) => p.slug !== slug).slice(0, 3);

  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, [slug]);

  const share = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(post?.title || "")}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent((post?.title || "") + " " + url)}`,
  };
  const copy = () => { navigator.clipboard.writeText(url); toast.success("Link copied"); };

  const cleanDesc = (post?.excerpt || "")
    .replace(/https?:\/\/\S+/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 160) || (post?.title ? `${post.title} — Read the full article by MD. Shinha Sarder.` : "");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      {post && (
        <Helmet>
          <title>{post.title} | MD. Shinha Sarder</title>
          <meta name="description" content={cleanDesc} />
          <link rel="canonical" href={url} />
          <meta property="og:title" content={post.title} />
          <meta property="og:description" content={cleanDesc} />
          <meta property="og:type" content="article" />
          <meta property="og:url" content={url} />
          {post.image && <meta property="og:image" content={post.image} />}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={post.title} />
          <meta name="twitter:description" content={cleanDesc} />
          {post.image && <meta name="twitter:image" content={post.image} />}
          <script type="application/ld+json">{JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: post.title,
            description: cleanDesc,
            image: post.image ? [post.image] : undefined,
            datePublished: post.published,
            dateModified: post.updated,
            author: { "@type": "Person", name: "MD. Shinha Sarder" },
          })}</script>
        </Helmet>
      )}

      <article className="pt-32 pb-16">
        <div className="container mx-auto px-6 max-w-3xl">
          <Link to="/#blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-8">
            <ArrowLeft size={16} /> Back to posts
          </Link>

          {loading && <div className="space-y-4"><div className="h-12 bg-card animate-pulse rounded" /><div className="h-80 bg-card animate-pulse rounded" /></div>}

          {!loading && !post && (
            <div className="text-center py-20">
              <h1 className="text-2xl font-serif mb-4">Post not found</h1>
              <Link to="/" className="text-primary hover:underline">Go home</Link>
            </div>
          )}

          {post && (
            <>
              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags.map((t) => (
                  <span key={t} className="text-[10px] uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-full font-medium">{t}</span>
                ))}
              </div>
              <h1 className="text-3xl sm:text-5xl font-serif font-bold mb-4 leading-tight">{post.title}</h1>
              <div className="flex items-center gap-3 text-sm text-muted-foreground mb-8">
                <Calendar size={14} className="text-primary" /> {fmt(post.published)}
              </div>
              {post.image && (
                <img src={post.image} alt={post.title} className="w-full rounded-xl mb-8 border border-border" />
              )}
              <div
                className="prose prose-invert max-w-none prose-headings:font-serif prose-a:text-primary prose-img:rounded-lg prose-img:mx-auto text-justify [&_p]:text-justify [&_li]:text-justify"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              <div className="mt-12 pt-8 border-t border-border">
                <p className="text-sm text-muted-foreground mb-3">Share this post</p>
                <div className="flex flex-wrap gap-3">
                  <a href={share.facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:text-primary hover:border-primary transition-colors"><Facebook size={16} /></a>
                  <a href={share.twitter} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:text-primary hover:border-primary transition-colors"><Twitter size={16} /></a>
                  <a href={share.linkedin} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:text-primary hover:border-primary transition-colors"><Linkedin size={16} /></a>
                  <a href={share.whatsapp} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:text-primary hover:border-primary transition-colors"><MessageCircle size={16} /></a>
                  <button onClick={copy} className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:text-primary hover:border-primary transition-colors"><LinkIcon size={16} /></button>
                </div>
              </div>

              {related.length > 0 && (
                <div className="mt-16">
                  <h3 className="font-serif text-2xl mb-6">Related Posts</h3>
                  <div className="grid sm:grid-cols-3 gap-4">
                    {related.map((r) => (
                      <Link key={r.id} to={postPath(r)} className="group bg-gradient-card rounded-lg overflow-hidden border border-border hover:border-primary/40 transition-all">
                        {r.image && <img src={r.image} alt={r.title} loading="lazy" className="w-full aspect-video object-cover" />}
                        <div className="p-3">
                          <h4 className="text-sm font-serif font-semibold line-clamp-2 group-hover:text-primary transition-colors">{r.title}</h4>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </article>
      <FooterSection />
    </div>
  );
};

export default PostDetail;
