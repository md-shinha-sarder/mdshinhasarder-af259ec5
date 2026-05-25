import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

const FEED = "https://www.mdshinhasarder.com/atom.xml?redirect=false&start-index=1&max-results=500";

function pick(xml: string, tag: string, attr?: string): string | null {
  if (attr) {
    const re = new RegExp(`<${tag}[^>]*${attr}="([^"]+)"`, "i");
    const m = xml.match(re); return m ? m[1] : null;
  }
  const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "i");
  const m = xml.match(re); return m ? m[1] : null;
}
function pickAll(xml: string, tag: string): string[] {
  const out: string[] = [];
  const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "gi");
  let m; while ((m = re.exec(xml)) !== null) out.push(m[1]);
  return out;
}
function decode(s: string) {
  return s.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, "&").replace(/&nbsp;/g, " ");
}
function strip(html: string) { return decode(html).replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim(); }
function slugFromUrl(u: string) { try { const p = new URL(u).pathname; return p.replace(/\/$/, "").split("/").pop() || "post"; } catch { return "post"; } }

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const res = await fetch(FEED);
    const xml = await res.text();
    const entries = pickAll(xml, "entry").map((e) => {
      const title = strip(pick(e, "title") || "");
      const published = pick(e, "published") || "";
      const updated = pick(e, "updated") || "";
      const contentRaw = pick(e, "content") || "";
      const content = decode(contentRaw);
      const excerpt = strip(content).slice(0, 200);
      const imgMatch = content.match(/<img[^>]+src=["']([^"']+)["']/i);
      const image = imgMatch ? imgMatch[1].replace(/\/s\d+(-c)?\//, "/s1600/").replace(/=w\d+-h\d+(-c)?$/, "=w1200") : null;
      const linkRe = /<link[^>]*rel=["']alternate["'][^>]*href=["']([^"']+)["']/i;
      const lm = e.match(linkRe);
      const url = lm ? lm[1] : "";
      const tags: string[] = [];
      const catRe = /<category[^>]*term=["']([^"']+)["']/gi;
      let cm; while ((cm = catRe.exec(e)) !== null) if (cm[1] !== "Latest") tags.push(cm[1]);
      const id = slugFromUrl(url);
      return { id, title, slug: id, url, image, excerpt, content, published, updated, tags };
    });
    return new Response(JSON.stringify({ posts: entries }), {
      headers: { ...corsHeaders, "Content-Type": "application/json", "Cache-Control": "public, max-age=600" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
