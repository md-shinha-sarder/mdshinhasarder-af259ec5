import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, XCircle, AlertTriangle, Send, ExternalLink, RefreshCw, Zap, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { usePosts } from "@/hooks/usePosts";
import { postPath } from "@/lib/postUrl";
import { useHomeSections, HOME_SECTIONS } from "@/hooks/useHomeSections";
import { buildSeo } from "@/lib/seo";
import { toast } from "sonner";

const FN = "https://ihegjzwlvthfqwredssj.supabase.co/functions/v1";

interface Check { ok: boolean; warn?: boolean; label: string; detail?: string }

const check = (post: ReturnType<typeof usePosts>["posts"][number]): Check[] => {
  const seo = buildSeo(post);
  const descLen = seo.metaDescription.length;
  const titleLen = seo.metaTitle.length;
  const heads = post.title.length;
  const hasImage = !!post.image;
  const date = post.published ? new Date(post.published).toString() !== "Invalid Date" : false;
  const tags = (post.tags || []).length > 0;
  const slugOk = /^[a-z0-9-]+$/.test(post.slug);
  const canonicalOk = /^https:\/\/mdshinhasarder\.com\/\d{4}\/\d{2}\/[a-z0-9-]+\.html$/.test(seo.canonical);
  return [
    { ok: heads > 0 && heads <= 110, label: `Headline length (${heads}/110)` },
    { ok: titleLen > 0 && titleLen <= 60, warn: titleLen > 60, label: `Meta title length (${titleLen}/60)`, detail: titleLen > 60 ? "Truncated by Google" : "OK" },
    { ok: descLen >= 60 && descLen <= 160, warn: descLen > 0 && (descLen < 60 || descLen > 160), label: `Meta description (${descLen}/160)`, detail: !descLen ? "Missing" : descLen < 60 ? "Too short" : descLen > 160 ? "Too long" : "OK" },
    { ok: !!seo.ogTitle && !!seo.ogDescription, label: "OG / Twitter tags generated" },
    { ok: canonicalOk, label: "Canonical URL valid", detail: canonicalOk ? "OK" : seo.canonical },
    { ok: hasImage, label: "Featured image present" },
    { ok: date, label: "Valid publish date" },
    { ok: tags, warn: !tags, label: "Keywords / tags" },
    { ok: slugOk, label: "Clean slug format" },
  ];
};

const NewsCheckAdmin = () => {
  const { posts, loading, refetch } = usePosts();
  const { sections, setSection, reset } = useHomeSections();
  const [busy, setBusy] = useState<string | null>(null);
  const [auditedAt, setAuditedAt] = useState<Date | null>(null);
  const [reindexProgress, setReindexProgress] = useState<{ done: number; total: number } | null>(null);

  const summary = useMemo(() => {
    let pass = 0, warn = 0, fail = 0;
    posts.forEach((p) => check(p).forEach((c) => c.ok ? pass++ : c.warn ? warn++ : fail++));
    return { pass, warn, fail };
  }, [posts, auditedAt]);

  const ping = async (url?: string) => {
    setBusy(url || "all");
    try {
      const r = await fetch(`${FN}/ping-indexing${url ? `?url=${encodeURIComponent(url)}` : ""}`);
      const j = await r.json();
      console.log("ping", j);
      toast.success(url ? "Pinged search engines for this URL" : "Pinged sitemaps");
    } catch {
      toast.error("Ping failed");
    } finally { setBusy(null); }
  };

  const rerun = async () => {
    setBusy("rerun");
    try {
      await refetch();
      setAuditedAt(new Date());
      toast.success("Re-audited all posts");
    } catch { toast.error("Re-audit failed"); } finally { setBusy(null); }
  };

  const reindexAll = async () => {
    setBusy("reindex");
    setReindexProgress({ done: 0, total: posts.length + 1 });
    try {
      await fetch(`${FN}/ping-indexing`);
      setReindexProgress({ done: 1, total: posts.length + 1 });
      let done = 1;
      const batch = 5;
      for (let i = 0; i < posts.length; i += batch) {
        const slice = posts.slice(i, i + batch);
        await Promise.all(slice.map((p) =>
          fetch(`${FN}/ping-indexing?url=${encodeURIComponent(`https://mdshinhasarder.com${postPath(p)}`)}`).catch(() => {})
        ));
        done += slice.length;
        setReindexProgress({ done, total: posts.length + 1 });
      }
      toast.success(`Re-indexed ${posts.length} URLs + sitemaps`);
    } catch { toast.error("Reindex failed"); } finally {
      setBusy(null);
      setTimeout(() => setReindexProgress(null), 2500);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-serif font-bold text-gradient-gold">Google News Eligibility</h1>
          <p className="text-sm text-muted-foreground mt-1">Validates NewsArticle requirements, description length and sitemap inclusion for every post.</p>
          {auditedAt && <p className="text-[11px] text-muted-foreground/70 mt-1">Last audit: {auditedAt.toLocaleTimeString()}</p>}
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button onClick={rerun} disabled={busy !== null} variant="outline" className="gap-2"><RefreshCw size={14} className={busy === "rerun" ? "animate-spin" : ""} /> Re-run check</Button>
          <Button onClick={reindexAll} disabled={busy !== null} className="gap-2"><Zap size={14} /> One-click reindex</Button>
        </div>
      </div>

      {reindexProgress && (
        <div className="p-3 rounded-lg border border-primary/30 bg-primary/5">
          <div className="flex justify-between text-xs mb-1.5"><span>Reindexing…</span><span>{reindexProgress.done}/{reindexProgress.total}</span></div>
          <div className="h-1.5 bg-card rounded-full overflow-hidden"><div className="h-full bg-primary transition-all" style={{ width: `${(reindexProgress.done / reindexProgress.total) * 100}%` }} /></div>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl border border-border bg-card/60"><div className="text-xs text-muted-foreground">Posts</div><div className="text-2xl font-bold">{posts.length}</div></div>
        <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5"><div className="text-xs text-emerald-400">Passing</div><div className="text-2xl font-bold">{summary.pass}</div></div>
        <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/5"><div className="text-xs text-amber-400">Warnings</div><div className="text-2xl font-bold">{summary.warn}</div></div>
        <div className="p-4 rounded-xl border border-rose-500/30 bg-rose-500/5"><div className="text-xs text-rose-400">Failing</div><div className="text-2xl font-bold">{summary.fail}</div></div>
      </div>

      <div className="p-4 rounded-xl border border-border bg-card/40">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-serif font-semibold flex items-center gap-2"><LayoutGrid size={16} className="text-primary" /> Homepage sections</h2>
          <Button size="sm" variant="ghost" onClick={reset} className="h-7 text-xs">Reset</Button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {HOME_SECTIONS.map((s) => (
            <label key={s.key} className="flex items-center justify-between gap-3 px-3 py-2 rounded-lg border border-border bg-background/40">
              <span className="text-sm">{s.label}</span>
              <Switch checked={!!sections[s.key]} onCheckedChange={(v) => setSection(s.key, v)} />
            </label>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button onClick={() => ping()} disabled={busy === "all"} variant="outline" className="gap-2"><Send size={14} /> Ping sitemaps only</Button>
        <a href="/sitemap.xml" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm px-3 py-2 rounded-md border border-border hover:border-primary"><ExternalLink size={12} /> sitemap.xml</a>
        <a href="/news-sitemap.xml" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm px-3 py-2 rounded-md border border-border hover:border-primary"><ExternalLink size={12} /> news-sitemap.xml</a>
        <a href="/video-sitemap.xml" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm px-3 py-2 rounded-md border border-border hover:border-primary"><ExternalLink size={12} /> video-sitemap.xml</a>
        <a href="/image-sitemap.xml" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm px-3 py-2 rounded-md border border-border hover:border-primary"><ExternalLink size={12} /> image-sitemap.xml</a>
      </div>

      {loading && <div className="text-sm text-muted-foreground">Loading posts…</div>}

      <div className="space-y-3">
        {posts.map((p) => {
          const checks = check(p);
          const fails = checks.filter((c) => !c.ok && !c.warn).length;
          const warns = checks.filter((c) => c.warn).length;
          return (
            <div key={p.id} className="p-4 rounded-xl border border-border bg-card/40">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="min-w-0">
                  <Link to={postPath(p)} className="font-serif font-semibold hover:text-primary line-clamp-1">{p.title}</Link>
                  <div className="text-xs text-muted-foreground mt-0.5">{new Date(p.published).toLocaleDateString()} · /{p.slug}</div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${fails ? "bg-rose-500/15 text-rose-400" : warns ? "bg-amber-500/15 text-amber-400" : "bg-emerald-500/15 text-emerald-400"}`}>
                    {fails ? `${fails} fail` : warns ? `${warns} warn` : "Eligible"}
                  </span>
                  <Button size="sm" variant="outline" onClick={() => ping(`https://mdshinhasarder.com${postPath(p)}`)} disabled={busy !== null} className="gap-1 h-7"><Send size={12} /> Ping</Button>
                </div>
              </div>
              <ul className="grid sm:grid-cols-2 gap-1.5 text-xs">
                {checks.map((c, i) => (
                  <li key={i} className="flex items-center gap-2">
                    {c.ok ? <CheckCircle2 size={13} className="text-emerald-400" /> : c.warn ? <AlertTriangle size={13} className="text-amber-400" /> : <XCircle size={13} className="text-rose-400" />}
                    <span className="text-muted-foreground">{c.label}</span>
                    {c.detail && <span className="text-[10px] text-muted-foreground/70">· {c.detail}</span>}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NewsCheckAdmin;
