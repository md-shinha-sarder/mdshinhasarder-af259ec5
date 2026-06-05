import type { BlogPost } from "@/hooks/usePosts";
import { postPath } from "@/lib/postUrl";

export const SITE = {
  name: "MD. Shinha Sarder",
  url: "https://mdshinhasarder.com",
  twitter: "@mdshinhasarder",
  description:
    "MD. Shinha Sarder is known as the Founder & CEO of IT Tech BD and Biostar TV World who was born on 5 November, 2004. He is also known as an Engineer, Developer.",
};

const stripHtml = (s: string) =>
  s
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");

export const cleanText = (raw: string) =>
  raw
    .replace(/https?:\/\/\S+/g, "")
    .replace(/\[[^\]]*\]/g, "")
    .replace(/[•▪●■◦‣⁃]/g, "")
    .replace(/[\r\n\t]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

export const autoDescription = (post: Pick<BlogPost, "title" | "excerpt" | "content">): string => {
  const sources = [post.excerpt || "", stripHtml(post.content || "")];
  for (const raw of sources) {
    const clean = cleanText(raw);
    if (clean.length >= 60) {
      const slice = clean.slice(0, 158);
      const cut = slice.lastIndexOf(" ");
      return (cut > 90 ? slice.slice(0, cut) : slice).trim() + (clean.length > 158 ? "…" : "");
    }
  }
  return post.title ? `${post.title} — Read the full article by ${SITE.name}.`.slice(0, 158) : "";
};

export const autoTitle = (title: string): string => {
  const suffix = ` | ${SITE.name}`;
  const max = 60;
  if (title.length + suffix.length <= max) return title + suffix;
  if (title.length <= max) return title;
  return title.slice(0, max - 1).trimEnd() + "…";
};

export const buildSeo = (post: BlogPost) => {
  const canonical = `${SITE.url}${postPath(post)}`;
  const metaTitle = autoTitle(post.title);
  const metaDescription = autoDescription(post);
  return {
    canonical,
    metaTitle,
    metaDescription,
    ogImage: post.image || `${SITE.url}/favicon.ico`,
    ogTitle: post.title.slice(0, 110),
    ogDescription: metaDescription,
    twitterTitle: post.title.slice(0, 70),
    twitterDescription: metaDescription,
  };
};
