import type { BlogPost } from "@/hooks/usePosts";

export const postPath = (p: { slug: string; published?: string; url?: string }) => {
  let y = "", m = "";
  if (p.url) {
    const match = p.url.match(/\/(\d{4})\/(\d{2})\//);
    if (match) { y = match[1]; m = match[2]; }
  }
  if (!y && p.published) {
    const d = new Date(p.published);
    if (!isNaN(d.getTime())) {
      y = String(d.getFullYear());
      m = String(d.getMonth() + 1).padStart(2, "0");
    }
  }
  if (!y) { const d = new Date(); y = String(d.getFullYear()); m = String(d.getMonth() + 1).padStart(2, "0"); }
  return `/${y}/${m}/${p.slug}.html`;
};

export const findPostBySlug = (posts: BlogPost[], slug?: string) =>
  posts.find((p) => p.slug === slug || `${p.slug}.html` === slug);
