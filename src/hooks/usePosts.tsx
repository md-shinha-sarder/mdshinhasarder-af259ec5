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

async function load(type: "posts" | "pages"): Promise<BlogPost[]> {
  if (cache[type]) return cache[type];
  if (inflight[type]) return inflight[type];
  inflight[type] = (async () => {
    const { data, error } = await supabase.functions.invoke(`fetch-posts?type=${type}`);
    if (error) throw error;
    cache[type] = (data?.posts ?? data?.items ?? []) as BlogPost[];
    return cache[type];
  })();
  return inflight[type];
}

export const usePosts = () => {
  const [posts, setPosts] = useState<BlogPost[]>(cache.posts ?? []);
  const [loading, setLoading] = useState(!cache.posts);
  useEffect(() => {
    load("posts").then((p) => { setPosts(p); setLoading(false); }).catch(() => setLoading(false));
  }, []);
  return { posts, loading };
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
