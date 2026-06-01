import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

const YT_HANDLE = "MD-Shinha-Sarder";
const FB_HANDLE = "md.shinha.sarder";

function pickAll(xml: string, tag: string) {
  const out: string[] = []; const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "gi");
  let m; while ((m = re.exec(xml)) !== null) out.push(m[1]); return out;
}
function pick(xml: string, tag: string) {
  const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "i"); const m = xml.match(re); return m ? m[1] : "";
}

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";

async function getChannelId(handle: string): Promise<string | null> {
  try {
    const html = await fetch(`https://www.youtube.com/@${handle}`, { headers: { "User-Agent": UA } }).then((r) => r.text());
    const m = html.match(/"channelId":"(UC[\w-]+)"/) || html.match(/channel_id=(UC[\w-]+)/);
    return m ? m[1] : null;
  } catch { return null; }
}

async function getYouTubeLongs(handle: string) {
  const channelId = await getChannelId(handle);
  if (!channelId) return [];
  const xml = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`).then((r) => r.text());
  return pickAll(xml, "entry").map((e) => {
    const id = pick(e, "yt:videoId");
    const title = pick(e, "title");
    const published = pick(e, "published");
    const thumbMatch = e.match(/<media:thumbnail[^>]+url=["']([^"']+)["']/i);
    const thumb = thumbMatch ? thumbMatch[1] : `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
    return {
      id, title, published, thumbnail: thumb,
      url: `https://www.youtube.com/watch?v=${id}`,
      shortUrl: `https://www.youtube.com/shorts/${id}`,
      embed: `https://www.youtube.com/embed/${id}`,
      platform: "youtube" as const,
      kind: "video" as const,
    };
  });
}

async function getYouTubeShorts(handle: string) {
  try {
    const html = await fetch(`https://www.youtube.com/@${handle}/shorts`, { headers: { "User-Agent": UA } }).then((r) => r.text());
    const ids = new Set<string>();
    const re = /"videoId":"([\w-]{11})"/g; let m;
    while ((m = re.exec(html)) !== null) ids.add(m[1]);
    return Array.from(ids).slice(0, 40).map((id) => ({
      id, title: "YouTube Short", published: new Date().toISOString(),
      thumbnail: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
      url: `https://www.youtube.com/shorts/${id}`,
      shortUrl: `https://www.youtube.com/shorts/${id}`,
      embed: `https://www.youtube.com/embed/${id}`,
      platform: "youtube" as const,
      kind: "short" as const,
    }));
  } catch { return []; }
}

async function getFacebookReels(handle: string) {
  try {
    const html = await fetch(`https://www.facebook.com/${handle}/reels/`, { headers: { "User-Agent": UA } }).then((r) => r.text());
    const ids = new Set<string>();
    const re = /\/reel\/(\d{6,})/g; let m;
    while ((m = re.exec(html)) !== null) ids.add(m[1]);
    return Array.from(ids).slice(0, 24).map((id) => ({
      id, title: "Facebook Reel", published: new Date().toISOString(),
      thumbnail: "",
      url: `https://www.facebook.com/reel/${id}`,
      shortUrl: `https://www.facebook.com/reel/${id}`,
      embed: `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(`https://www.facebook.com/reel/${id}`)}&show_text=false`,
      platform: "facebook" as const,
      kind: "reel" as const,
    }));
  } catch { return []; }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const url = new URL(req.url);
    const page = Math.max(1, parseInt(url.searchParams.get("page") || "1", 10));
    const pageSize = Math.min(48, Math.max(4, parseInt(url.searchParams.get("pageSize") || "12", 10)));

    const [longs, shorts, fbReels] = await Promise.all([
      getYouTubeLongs(YT_HANDLE),
      getYouTubeShorts(YT_HANDLE),
      getFacebookReels(FB_HANDLE),
    ]);
    const videos = [...longs];
    const reels = [...shorts, ...fbReels];

    const start = (page - 1) * pageSize;
    const pagedVideos = videos.slice(start, start + pageSize);
    const hasMore = videos.length > start + pageSize;

    return new Response(JSON.stringify({
      videos: pagedVideos, reels,
      allVideos: videos, allReels: reels,
      page, pageSize, total: videos.length, hasMore,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json", "Cache-Control": "public, max-age=900" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e), videos: [], reels: [] }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
