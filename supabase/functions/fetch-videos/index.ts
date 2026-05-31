import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

const YT_HANDLE = "MD-Shinha-Sarder";

function pickAll(xml: string, tag: string) {
  const out: string[] = []; const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "gi");
  let m; while ((m = re.exec(xml)) !== null) out.push(m[1]); return out;
}
function pick(xml: string, tag: string) {
  const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "i"); const m = xml.match(re); return m ? m[1] : "";
}

async function getChannelId(handle: string): Promise<string | null> {
  try {
    const html = await fetch(`https://www.youtube.com/@${handle}`, {
      headers: { "User-Agent": "Mozilla/5.0" },
    }).then((r) => r.text());
    const m = html.match(/"channelId":"(UC[\w-]+)"/) || html.match(/channel_id=(UC[\w-]+)/);
    return m ? m[1] : null;
  } catch { return null; }
}

async function getYouTubeVideos(handle: string) {
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
      id, title, published,
      thumbnail: thumb,
      url: `https://www.youtube.com/watch?v=${id}`,
      shortUrl: `https://www.youtube.com/shorts/${id}`,
      embed: `https://www.youtube.com/embed/${id}`,
      platform: "youtube",
    };
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const videos = await getYouTubeVideos(YT_HANDLE);
    return new Response(JSON.stringify({ videos }), {
      headers: { ...corsHeaders, "Content-Type": "application/json", "Cache-Control": "public, max-age=900" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e), videos: [] }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
