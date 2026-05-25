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

let cache: BlogPost[] | null = null;
let inflight: Promise<BlogPost[]> | null = null;

async function load(): Promise<BlogPost[]> {
  if (cache) return cache;
  if (inflight) return inflight;
  inflight = (async () => {
    const { data, error } = await supabase.functions.invoke("fetch-posts");
    if (error) throw error;
    cache = (data?.posts ?? []) as BlogPost[];
    return cache;
  })();
  return inflight;
}

export const usePosts = () => {
  const [posts, setPosts] = useState<BlogPost[]>(cache ?? []);
  const [loading, setLoading] = useState(!cache);
  useEffect(() => {
    load().then((p) => { setPosts(p); setLoading(false); }).catch(() => setLoading(false));
  }, []);
  return { posts, loading };
};

export const usePost = (slug?: string) => {
  const { posts, loading } = usePosts();
  const post = posts.find((p) => p.slug === slug);
  return { post, loading };
};
