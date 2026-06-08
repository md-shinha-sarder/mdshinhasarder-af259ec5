// Image SEO helpers: descriptive alt text + proper sizing/loading attributes.

const BRAND = "MD. Shinha Sarder";

export function buildAlt(title?: string | null, extra?: string | string[] | null): string {
  const t = (title || "").trim();
  const tags = Array.isArray(extra) ? extra.filter(Boolean).join(", ") : (extra || "");
  const parts = [t, tags, BRAND].filter(Boolean);
  // De-duplicate words while preserving order; cap length for SEO.
  const seen = new Set<string>();
  const words: string[] = [];
  for (const w of parts.join(" - ").split(/\s+/)) {
    const k = w.toLowerCase().replace(/[^a-z0-9]/g, "");
    if (!k || seen.has(k)) continue;
    seen.add(k);
    words.push(w);
  }
  return words.join(" ").slice(0, 125);
}

/**
 * Rewrites <img> tags inside post HTML so search engines and browsers can
 * index and lay them out without CLS:
 *  - injects descriptive alt text (post title + index) when missing/empty
 *  - adds loading="lazy", decoding="async", fetchpriority="low" for inline images
 *  - adds width/height hints (1200x800) so the browser reserves space
 *  - keeps existing attributes intact
 */
export function enhanceContentImages(html: string, title?: string | null): string {
  if (!html) return html;
  let i = 0;
  return html.replace(/<img\b([^>]*?)\/?>(?!\s*<\/img>)/gi, (_m, attrs: string) => {
    i += 1;
    const hasAlt = /\balt\s*=/i.test(attrs);
    const hasLoading = /\bloading\s*=/i.test(attrs);
    const hasDecoding = /\bdecoding\s*=/i.test(attrs);
    const hasPriority = /\bfetchpriority\s*=/i.test(attrs);
    const hasWidth = /\bwidth\s*=/i.test(attrs);
    const hasHeight = /\bheight\s*=/i.test(attrs);

    let out = attrs.trim();
    if (!hasAlt) out += ` alt="${escapeAttr(buildAlt(title, `photo ${i}`))}"`;
    else out = out.replace(/\balt\s*=\s*(["'])\s*\1/i, ` alt="${escapeAttr(buildAlt(title, `photo ${i}`))}"`);
    if (!hasLoading) out += ` loading="lazy"`;
    if (!hasDecoding) out += ` decoding="async"`;
    if (!hasPriority) out += ` fetchpriority="low"`;
    if (!hasWidth) out += ` width="1200"`;
    if (!hasHeight) out += ` height="800"`;
    return `<img ${out} />`;
  });
}

function escapeAttr(s: string) {
  return s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
