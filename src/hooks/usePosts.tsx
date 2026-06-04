import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  url: string;
  image: string | null;
  excerpt: string;
  content: string;
  published: string;
  updated: string;
  tags: string[];
}

const cache: Record<string, BlogPost[]> = {};
const inflight: Record<string, Promise<BlogPost[]>> = {};
const subs: Record<string, Set<(p: BlogPost[]) => void>> = {};

async function load(type: "posts" | "pages", force = false): Promise<BlogPost[]> {
  if (!force && cache[type]) return cache[type];
  if (!force && inflight[type]) return inflight[type];
  inflight[type] = (async () => {
    const { data, error } = await supabase.functions.invoke(`fetch-posts?type=${type}${force ? `&t=${Date.now()}` : ""}`);
    if (error) throw error;
    cache[type] = (data?.posts ?? data?.items ?? []) as BlogPost[];
    (subs[type] ||= new Set()).forEach((fn) => fn(cache[type]));
    return cache[type];
  })();
  try { return await inflight[type]; } finally { delete inflight[type]; }
}

export const usePosts = () => {
  const [posts, setPosts] = useState<BlogPost[]>(cache.posts ?? []);
  const [loading, setLoading] = useState(!cache.posts);
  useEffect(() => {
    (subs.posts ||= new Set()).add(setPosts);
    load("posts").then((p) => { setPosts(p); setLoading(false); }).catch(() => setLoading(false));
    return () => { subs.posts?.delete(setPosts); };
  }, []);
  const refetch = async () => { setLoading(true); try { const p = await load("posts", true); setPosts(p); } finally { setLoading(false); } };
  return { posts, loading, refetch };
};

export const usePages = () => {
  const [pages, setPages] = useState<BlogPost[]>(cache.pages ?? []);
  const [loading, setLoading] = useState(!cache.pages);
  useEffect(() => {
    load("pages").then((p) => { setPages(p); setLoading(false); }).catch(() => setLoading(false));
  }, []);
  return { pages, loading };
};

export const usePost = (slug?: string) => {
  const { posts, loading } = usePosts();
  const { pages } = usePages();
  const post = posts.find((p) => p.slug === slug) || pages.find((p) => p.slug === slug);
  return { post, loading };
};
