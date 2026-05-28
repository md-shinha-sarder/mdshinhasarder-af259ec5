import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

const FEEDS = {
  posts: "https://shinhaauthor.blogspot.com/feeds/posts/default?max-results=500",
  pages: "https://shinhaauthor.blogspot.com/feeds/pages/default?max-results=500",
};

function pickAll(xml: string, tag: string): string[] {
  const out: string[] = [];
  const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "gi");
  let m; while ((m = re.exec(xml)) !== null) out.push(m[1]);
  return out;
}
function pick(xml: string, tag: string): string | null {
  const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "i");
  const m = xml.match(re); return m ? m[1] : null;
}
function decode(s: string) {
  return s
    .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'").replace(/&apos;/g, "'").replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&");
}
function strip(html: string) { return decode(html).replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim(); }
function slugFromUrl(u: string) { try { const p = new URL(u).pathname; return p.replace(/\/$/, "").split("/").pop()?.replace(/\.html?$/, "") || "post"; } catch { return "post"; } }
function upscale(url: string) { return url.replace(/\/s\d+(-c)?\//, "/s1600/").replace(/=w\d+-h\d+(-c)?$/, "=w1600"); }

function parseEntries(xml: string) {
  return pickAll(xml, "entry").map((e) => {
    const title = strip(pick(e, "title") || "");
    const published = pick(e, "published") || "";
    const updated = pick(e, "updated") || "";
    const contentRaw = pick(e, "content") || pick(e, "summary") || "";
    let content = decode(contentRaw);

    const imgMatch = content.match(/<img[^>]+src=["']([^"']+)["'][^>]*>/i);
    const image = imgMatch ? upscale(imgMatch[1]) : null;
    if (imgMatch) {
      content = content.replace(imgMatch[0], "");
      content = content.replace(/<a[^>]*>\s*<\/a>/gi, "");
    }
    content = content.replace(/<img([^>]+)>/gi, (_m, attrs) => {
      const src = attrs.match(/src=["']([^"']+)["']/i);
      return src ? `<img src="${upscale(src[1])}" loading="lazy" />` : "";
    });

    const plain = strip(content)
      .replace(/https?:\/\/\S+/g, "")
      .replace(/\[[^\]]*\]/g, "")
      .replace(/\s+/g, " ")
      .trim();
    let excerpt = plain.slice(0, 200);
    if (plain.length > 200) {
      const cut = excerpt.lastIndexOf(" ");
      if (cut > 80) excerpt = excerpt.slice(0, cut);
      excerpt += "…";
    }
    if (!excerpt) excerpt = title;
    const linkRe = /<link[^>]*rel=["']alternate["'][^>]*href=["']([^"']+)["']/i;
    const lm = e.match(linkRe);
    const url = lm ? lm[1] : "";
    const tags: string[] = [];
    const catRe = /<category[^>]*term=["']([^"']+)["']/gi;
    let cm; while ((cm = catRe.exec(e)) !== null) if (cm[1] !== "Latest") tags.push(cm[1]);
    const id = slugFromUrl(url);
    return { id, title, slug: id, url, image, excerpt, content, published, updated, tags };
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const url = new URL(req.url);
    const type = (url.searchParams.get("type") || "posts") as "posts" | "pages";
    const feedUrl = FEEDS[type] || FEEDS.posts;
    const res = await fetch(feedUrl);
    const xml = await res.text();
    const items = parseEntries(xml);
    return new Response(JSON.stringify({ posts: items, items }), {
      headers: { ...corsHeaders, "Content-Type": "application/json", "Cache-Control": "public, max-age=600" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
