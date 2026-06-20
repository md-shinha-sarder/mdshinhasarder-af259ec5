import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const BASE = "https://mdshinhasarder.com";
const FEED = "https://shinhaauthor.blogspot.com/feeds/posts/default?max-results=500";
const XSL = `<?xml-stylesheet type="text/xsl" href="${BASE}/sitemap.xsl"?>`;

type Entry = {
  title: string;
  slug: string;
  published: string;
  updated: string;
  excerpt: string;
  image: string | null;
  url?: string;
  content: string;
  tags: string[];
};

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
function postPath(e: { slug: string; published: string; url?: string }) {
  let y = "", m = "";
  if (e.url) { const mm = e.url.match(/\/(\d{4})\/(\d{2})\//); if (mm) { y = mm[1]; m = mm[2]; } }
  if (!y && e.published) { const d = new Date(e.published); if (!isNaN(d.getTime())) { y = String(d.getFullYear()); m = String(d.getMonth() + 1).padStart(2, "0"); } }
  if (!y) { const d = new Date(); y = String(d.getFullYear()); m = String(d.getMonth() + 1).padStart(2, "0"); }
  return `/${y}/${m}/${e.slug}.html`;
}

async function getDatabaseEntries(): Promise<Entry[]> {
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceKey) return [];
  const db = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });
  const { data, error } = await db
    .from("posts")
    .select("slug,title,excerpt,content,cover_url,tags,published_at,created_at,updated_at,status")
    .eq("status", "published")
    .order("published_at", { ascending: false });
  if (error || !data?.length) return [];
  return data.map((p: any) => ({
    title: p.title || "Untitled",
    slug: p.slug || "post",
    published: p.published_at || p.created_at || new Date().toISOString(),
    updated: p.updated_at || p.published_at || p.created_at || new Date().toISOString(),
    excerpt: p.excerpt || strip(p.content || "").slice(0, 240) || p.title || "",
    image: p.cover_url || null,
    url: "",
    content: p.content || "",
    tags: Array.isArray(p.tags) ? p.tags : [],
  }));
}

async function getBloggerEntries(): Promise<Entry[]> {
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
    const tags = [...e.matchAll(/<category[^>]+term=["']([^"']+)["']/gi)].map((m) => m[1]).filter((t) => t !== "Latest");
    return { title, slug: slugOf(url), published, updated, excerpt, image: img ? img[1] : null, url, content, tags };
  });

}

async function getEntries(): Promise<Entry[]> {
  const dbEntries = await getDatabaseEntries();
  return dbEntries.length ? dbEntries : await getBloggerEntries();
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
    <link>${BASE}${postPath(e)}</link>
    <guid isPermaLink="true">${BASE}${postPath(e)}</guid>
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

    if (type === "news") {
      const cutoff = Date.now() - 1000 * 60 * 60 * 24 * 2;
      const fresh = entries.filter((e) => new Date(e.published || 0).getTime() > cutoff);
      const items = fresh.map((e) => `
  <url>
    <loc>${BASE}${postPath(e)}</loc>
    <news:news>
      <news:publication><news:name>MD. Shinha Sarder</news:name><news:language>en</news:language></news:publication>
      <news:publication_date>${new Date(e.published || Date.now()).toISOString()}</news:publication_date>
      <news:title>${xmlEsc(e.title)}</news:title>
    </news:news>
  </url>`).join("");
      const news = `<?xml version="1.0" encoding="UTF-8"?>
${XSL}
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">${items}
</urlset>`;
      return new Response(news, { headers: { ...corsHeaders, "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, max-age=600" } });
    }

    if (type === "images") {
      const homeImg = `
  <url>
    <loc>${BASE}/</loc>
    <image:image><image:loc>${BASE}/profile.webp</image:loc><image:title>MD. Shinha Sarder</image:title><image:caption>Founder &amp; CEO of IT Tech BD and Biostar TV World</image:caption></image:image>
  </url>`;
      const items = entries.map((e) => {
        const imgs: string[] = [];
        if (e.image) imgs.push(e.image);
        const re = /<img[^>]+src=["']([^"']+)["']/gi; let m;
        while ((m = re.exec(e.content || "")) !== null) if (!imgs.includes(m[1])) imgs.push(m[1]);
        if (!imgs.length) return "";
        const imgBlocks = imgs.slice(0, 1000).map((u) => `\n    <image:image><image:loc>${xmlEsc(u)}</image:loc><image:title>${xmlEsc(e.title)}</image:title><image:caption>${xmlEsc(e.excerpt)}</image:caption></image:image>`).join("");
        return `\n  <url>\n    <loc>${BASE}${postPath(e)}</loc>${imgBlocks}\n  </url>`;
      }).join("");
      const imgs = `<?xml version="1.0" encoding="UTF-8"?>
${XSL}
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">${homeImg}${items}
</urlset>`;
      return new Response(imgs, { headers: { ...corsHeaders, "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, max-age=600" } });
    }

    if (type === "videos") {
      const items: string[] = [];
      for (const e of entries) {
        const re = /<iframe[^>]+src=["']([^"']+)["']/gi; let m;
        while ((m = re.exec(e.content || "")) !== null) {
          const src = m[1];
          const yt = src.match(/(?:youtube\.com\/embed\/|youtu\.be\/)([\w-]+)/);
          if (!yt) continue;
          const vid = yt[1];
          items.push(`
  <url>
    <loc>${BASE}${postPath(e)}</loc>
    <video:video>
      <video:thumbnail_loc>https://i.ytimg.com/vi/${vid}/hqdefault.jpg</video:thumbnail_loc>
      <video:title>${xmlEsc(e.title)}</video:title>
      <video:description>${xmlEsc(e.excerpt)}</video:description>
      <video:player_loc allow_embed="yes">https://www.youtube.com/embed/${vid}</video:player_loc>
      <video:publication_date>${new Date(e.published || Date.now()).toISOString()}</video:publication_date>
    </video:video>
  </url>`);
        }
      }
      const vids = `<?xml version="1.0" encoding="UTF-8"?>
${XSL}
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">${items.join("")}
</urlset>`;
      return new Response(vids, { headers: { ...corsHeaders, "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, max-age=600" } });
    }

    if (type === "index") {
      const now = new Date().toISOString();
      const idx = `<?xml version="1.0" encoding="UTF-8"?>
${XSL}
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap><loc>${BASE}/sitemap.xml</loc><lastmod>${now}</lastmod></sitemap>
  <sitemap><loc>${BASE}/post-sitemap.xml</loc><lastmod>${now}</lastmod></sitemap>
  <sitemap><loc>${BASE}/news-sitemap.xml</loc><lastmod>${now}</lastmod></sitemap>
  <sitemap><loc>${BASE}/image-sitemap.xml</loc><lastmod>${now}</lastmod></sitemap>
  <sitemap><loc>${BASE}/video-sitemap.xml</loc><lastmod>${now}</lastmod></sitemap>
  <sitemap><loc>${BASE}/category-sitemap.xml</loc><lastmod>${now}</lastmod></sitemap>
  <sitemap><loc>${BASE}/tag-sitemap.xml</loc><lastmod>${now}</lastmod></sitemap>
  <sitemap><loc>${BASE}/page-sitemap.xml</loc><lastmod>${now}</lastmod></sitemap>
</sitemapindex>`;
      return new Response(idx, { headers: { ...corsHeaders, "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, max-age=600" } });
    }

    if (type === "categories" || type === "tags") {
      const map = new Map<string, string>();
      for (const e of entries) {
        for (const t of e.tags || []) {
          const slug = t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
          if (!slug) continue;
          const prev = map.get(slug);
          if (!prev || e.updated > prev) map.set(slug, e.updated || e.published);
        }
      }
      const prefix = type === "categories" ? "/category" : "/tag";
      const items = [...map.entries()].map(([slug, lm]) => `
  <url>
    <loc>${BASE}${prefix}/${slug}</loc>
    <lastmod>${(lm || "").slice(0, 10)}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.5</priority>
  </url>`).join("");
      const out = `<?xml version="1.0" encoding="UTF-8"?>
${XSL}
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${items}
</urlset>`;
      return new Response(out, { headers: { ...corsHeaders, "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, max-age=600" } });
    }

    if (type === "pages") {
      const staticPaths = ["/", "/posts", "/#about", "/#skills", "/#projects", "/#services", "/#gallery", "/#music", "/#books", "/#publications", "/#blog"];
      const items = staticPaths.map((p) => `
  <url><loc>${BASE}${p}</loc><changefreq>weekly</changefreq><priority>${p === "/" ? "1.0" : "0.7"}</priority></url>`).join("");
      const out = `<?xml version="1.0" encoding="UTF-8"?>
${XSL}
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${items}
</urlset>`;
      return new Response(out, { headers: { ...corsHeaders, "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, max-age=600" } });
    }

    if (type === "posts") {
      const items = entries.map((e) => `
  <url>
    <loc>${BASE}${postPath(e)}</loc>
    <lastmod>${(e.updated || e.published || "").slice(0, 10)}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>${e.image ? `\n    <image:image><image:loc>${xmlEsc(e.image)}</image:loc><image:title>${xmlEsc(e.title)}</image:title></image:image>` : ""}
  </url>`).join("");
      const out = `<?xml version="1.0" encoding="UTF-8"?>
${XSL}
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">${items}
</urlset>`;
      return new Response(out, { headers: { ...corsHeaders, "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, max-age=600" } });
    }



    const staticPaths = ["/", "/posts", "/#about", "/#skills", "/#projects", "/#services", "/#gallery", "/#music", "/#books", "/#publications", "/#blog"];
    const urls = [
      ...staticPaths.map((p) => `<url><loc>${BASE}${p}</loc><changefreq>weekly</changefreq><priority>${p === "/" ? "1.0" : "0.7"}</priority></url>`),
      ...entries.map((e) => `<url>
    <loc>${BASE}${postPath(e)}</loc>
    <lastmod>${(e.updated || e.published || "").slice(0, 10)}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>${e.image ? `\n    <image:image><image:loc>${xmlEsc(e.image)}</image:loc><image:title>${xmlEsc(e.title)}</image:title></image:image>` : ""}
  </url>`),
    ].join("\n  ");
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
${XSL}
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  ${urls}
</urlset>`;
    return new Response(sitemap, { headers: { ...corsHeaders, "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, max-age=600" } });
  } catch (e) {
    return new Response(String(e), { status: 500, headers: corsHeaders });
  }
});
