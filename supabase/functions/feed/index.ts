import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

const BASE = "https://mdshinhasarder.lovable.app";
const FEED = "https://shinhaauthor.blogspot.com/feeds/posts/default?max-results=500";

function pickAll(xml: string, tag: string) {
  const out: string[] = []; const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "gi");
  let m; while ((m = re.exec(xml)) !== null) out.push(m[1]); return out;
}
function pick(xml: string, tag: string) {
  const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "i"); const m = xml.match(re); return m ? m[1] : "";
}
function dec(s: string) { return s.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, "&"); }
function strip(s: string) { return dec(s).replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim(); }
function xmlEsc(s: string) { return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;"); }
function slugOf(u: string) { try { const p = new URL(u).pathname; return p.replace(/\/$/, "").split("/").pop()?.replace(/\.html?$/, "") || "post"; } catch { return "post"; } }

async function getEntries() {
  const xml = await fetch(FEED).then((r) => r.text());
  return pickAll(xml, "entry").map((e) => {
    const title = strip(pick(e, "title"));
    const published = pick(e, "published");
    const updated = pick(e, "updated");
    const content = dec(pick(e, "content") || pick(e, "summary"));
    const excerpt = strip(content).slice(0, 240);
    const lm = e.match(/<link[^>]*rel=["']alternate["'][^>]*href=["']([^"']+)["']/i);
    const url = lm ? lm[1] : "";
    const img = content.match(/<img[^>]+src=["']([^"']+)["']/i);
    return { title, slug: slugOf(url), published, updated, excerpt, image: img ? img[1] : null };
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const type = new URL(req.url).searchParams.get("type") || "sitemap";
  try {
    const entries = await getEntries();
    if (type === "rss") {
      const items = entries.map((e) => `
  <item>
    <title>${xmlEsc(e.title)}</title>
    <link>${BASE}/post/${e.slug}</link>
    <guid isPermaLink="true">${BASE}/post/${e.slug}</guid>
    <pubDate>${new Date(e.published || Date.now()).toUTCString()}</pubDate>
    <description>${xmlEsc(e.excerpt)}</description>${e.image ? `\n    <enclosure url="${xmlEsc(e.image)}" type="image/jpeg" />` : ""}
  </item>`).join("");
      const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>MD. Shinha Sarder</title>
  <link>${BASE}</link>
  <atom:link href="${BASE}/rss.xml" rel="self" type="application/rss+xml" />
  <description>Articles, biography and updates by MD. Shinha Sarder.</description>
  <language>en</language>
  <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>${items}
</channel>
</rss>`;
      return new Response(rss, { headers: { ...corsHeaders, "Content-Type": "application/rss+xml; charset=utf-8", "Cache-Control": "public, max-age=600" } });
    }

    const staticPaths = ["/", "/posts", "/#about", "/#skills", "/#projects", "/#music", "/#books", "/#publications", "/#blog"];
    const urls = [
      ...staticPaths.map((p) => `<url><loc>${BASE}${p}</loc><changefreq>weekly</changefreq><priority>${p === "/" ? "1.0" : "0.7"}</priority></url>`),
      ...entries.map((e) => `<url><loc>${BASE}/post/${e.slug}</loc><lastmod>${(e.updated || e.published || "").slice(0, 10)}</lastmod><changefreq>monthly</changefreq><priority>0.6</priority></url>`),
    ].join("\n  ");
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls}
</urlset>`;
    return new Response(sitemap, { headers: { ...corsHeaders, "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, max-age=600" } });
  } catch (e) {
    return new Response(String(e), { status: 500, headers: corsHeaders });
  }
});
