const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const BASE = "https://mdshinhasarder.com";
const FN = "https://ihegjzwlvthfqwredssj.supabase.co/functions/v1/feed";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const u = new URL(req.url);
  const url = u.searchParams.get("url") || BASE;
  const sitemaps = [
    `${BASE}/sitemap.xml`,
    `${BASE}/news-sitemap.xml`,
    `${BASE}/image-sitemap.xml`,
    `${BASE}/video-sitemap.xml`,
  ];

  const results: Record<string, unknown> = {};
  await Promise.all([
    ...sitemaps.map(async (sm) => {
      const g = `https://www.google.com/ping?sitemap=${encodeURIComponent(sm)}`;
      const b = `https://www.bing.com/ping?sitemap=${encodeURIComponent(sm)}`;
      try {
        const [gr, br] = await Promise.all([fetch(g), fetch(b)]);
        results[sm] = { google: gr.status, bing: br.status };
      } catch (e) { results[sm] = { error: String(e) }; }
    }),
    (async () => {
      try {
        const r = await fetch(`https://pubsubhubbub.appspot.com/publish`, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: `hub.mode=publish&hub.url=${encodeURIComponent(`${BASE}/rss.xml`)}`,
        });
        results["pubsubhubbub"] = r.status;
      } catch (e) { results["pubsubhubbub"] = String(e); }
    })(),
  ]);

  return new Response(JSON.stringify({ pinged: url, sitemaps, results, feed: FN }, null, 2), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
