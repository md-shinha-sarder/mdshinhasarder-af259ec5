// Rewrites Supabase Storage URLs to the site's own domain (proxied via _redirects).
// e.g. https://<ref>.supabase.co/storage/v1/object/public/media/foo.jpg
//      -> https://mdshinhasarder.com/media/foo.jpg
const SITE = "https://mdshinhasarder.com";
const STORAGE_RE = /https?:\/\/[^/]+\/storage\/v1\/object\/public\/media\/(.+)$/i;

export function toSiteMediaUrl(url?: string | null): string {
  if (!url) return "";
  const m = url.match(STORAGE_RE);
  if (m) return `${SITE}/media/${m[1]}`;
  return url;
}
