import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface VideoItem {
  id: string;
  title: string;
  published: string;
  thumbnail: string;
  url: string;
  shortUrl: string;
  embed: string;
  platform: "youtube" | "facebook";
  kind?: "video" | "short" | "reel";
}

interface Cache {
  videos: VideoItem[];
  reels: VideoItem[];
  page: number;
  pageSize: number;
  total: number;
  hasMore: boolean;
}

let cache: Cache | null = null;
let inflight: Promise<Cache> | null = null;

async function fetchPage(page: number, pageSize: number): Promise<Cache> {
  const { data } = await supabase.functions.invoke("fetch-videos", {
    body: { page, pageSize },
  });
  return {
    videos: (data?.videos ?? []) as VideoItem[],
    reels: (data?.reels ?? []) as VideoItem[],
    page: data?.page ?? page,
    pageSize: data?.pageSize ?? pageSize,
    total: data?.total ?? 0,
    hasMore: !!data?.hasMore,
  };
}

export const useVideos = (initialPageSize = 12) => {
  const [state, setState] = useState<Cache>(cache ?? { videos: [], reels: [], page: 1, pageSize: initialPageSize, total: 0, hasMore: false });
  const [loading, setLoading] = useState(!cache);

  useEffect(() => {
    if (cache) return;
    if (!inflight) inflight = fetchPage(1, initialPageSize).then((c) => (cache = c));
    inflight.then((c) => { setState(c); setLoading(false); }).catch(() => setLoading(false));
  }, [initialPageSize]);

  const loadMore = useCallback(async () => {
    if (!state.hasMore || loading) return;
    setLoading(true);
    const next = await fetchPage(state.page + 1, state.pageSize);
    const merged: Cache = {
      ...next,
      videos: [...state.videos, ...next.videos],
      reels: state.reels.length ? state.reels : next.reels,
    };
    cache = merged;
    setState(merged);
    setLoading(false);
  }, [state, loading]);

  return { videos: state.videos, reels: state.reels, loading, hasMore: state.hasMore, loadMore };
};
