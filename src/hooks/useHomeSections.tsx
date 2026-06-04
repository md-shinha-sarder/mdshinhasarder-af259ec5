import { useEffect, useState } from "react";

export const HOME_SECTIONS = [
  { key: "hero", label: "Hero" },
  { key: "about", label: "Biography" },
  { key: "skills", label: "Skills" },
  { key: "projects", label: "Projects" },
  { key: "services", label: "Services" },
  { key: "gallery", label: "Gallery" },
  { key: "videos", label: "Videos" },
  { key: "reels", label: "Reels & Shorts" },
  { key: "music", label: "Music" },
  { key: "books", label: "Books" },
  { key: "publications", label: "Publications" },
  { key: "blog", label: "Blog" },
] as const;

export type HomeSectionKey = (typeof HOME_SECTIONS)[number]["key"];
const KEY = "home-sections-v1";
const defaults: Record<string, boolean> = Object.fromEntries(HOME_SECTIONS.map((s) => [s.key, true]));

const read = (): Record<string, boolean> => {
  try { return { ...defaults, ...JSON.parse(localStorage.getItem(KEY) || "{}") }; } catch { return defaults; }
};

const listeners = new Set<(v: Record<string, boolean>) => void>();

export const useHomeSections = () => {
  const [sections, setSections] = useState<Record<string, boolean>>(read);
  useEffect(() => {
    const fn = (v: Record<string, boolean>) => setSections(v);
    listeners.add(fn);
    return () => { listeners.delete(fn); };
  }, []);
  const setSection = (key: string, on: boolean) => {
    const next = { ...read(), [key]: on };
    localStorage.setItem(KEY, JSON.stringify(next));
    listeners.forEach((l) => l(next));
  };
  const reset = () => { localStorage.setItem(KEY, JSON.stringify(defaults)); listeners.forEach((l) => l(defaults)); };
  return { sections, setSection, reset };
};
