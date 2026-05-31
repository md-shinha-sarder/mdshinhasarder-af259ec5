import { useEffect, useState } from "react";
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
}

let cache: VideoItem[] | null = null;
let inflight: Promise<VideoItem[]> | null = null;

export const useVideos = () => {
  const [videos, setVideos] = useState<VideoItem[]>(cache ?? []);
  const [loading, setLoading] = useState(!cache);
  useEffect(() => {
    if (cache) return;
    if (!inflight) {
      inflight = (async () => {
        const { data } = await supabase.functions.invoke("fetch-videos");
        cache = (data?.videos ?? []) as VideoItem[];
        return cache;
      })();
    }
    inflight.then((v) => { setVideos(v); setLoading(false); }).catch(() => setLoading(false));
  }, []);
  return { videos, loading };
};
