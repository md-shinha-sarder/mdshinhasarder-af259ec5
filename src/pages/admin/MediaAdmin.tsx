import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Upload, Trash2, Copy } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

interface MediaItem { id: string; name: string; url: string; path: string; mime_type: string | null; size_bytes: number | null; }

const MediaAdmin = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<MediaItem[]>([]);
  const [busy, setBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    const { data } = await supabase.from("media").select("*").order("created_at", { ascending: false });
    setItems((data as MediaItem[]) || []);
  };
  useEffect(() => { load(); }, []);

  const upload = async (files: FileList | null) => {
    if (!files || !user) return;
    setBusy(true);
    try {
      for (const file of Array.from(files)) {
        const path = `${user.id}/${Date.now()}-${file.name}`;
        const { error: upErr } = await supabase.storage.from("media").upload(path, file);
        if (upErr) throw upErr;
        const { data: pub } = supabase.storage.from("media").getPublicUrl(path);
        const { error: insErr } = await supabase.from("media").insert({
          name: file.name, url: pub.publicUrl, path, mime_type: file.type, size_bytes: file.size, uploaded_by: user.id,
        });
        if (insErr) throw insErr;
      }
      toast.success("Uploaded");
      load();
    } catch (e: any) { toast.error(e.message); }
    finally { setBusy(false); if (fileRef.current) fileRef.current.value = ""; }
  };

  const remove = async (m: MediaItem) => {
    if (!confirm("Delete this file?")) return;
    await supabase.storage.from("media").remove([m.path]);
    await supabase.from("media").delete().eq("id", m.id);
    toast.success("Deleted"); load();
  };

  const copy = (u: string) => { navigator.clipboard.writeText(u); toast.success("URL copied"); };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-3xl font-serif font-bold">Media Library</h1><p className="text-muted-foreground">Upload and manage images and files.</p></div>
        <div>
          <input ref={fileRef} type="file" multiple hidden onChange={(e) => upload(e.target.files)} />
          <Button onClick={() => fileRef.current?.click()} disabled={busy} className="bg-gradient-gold text-primary-foreground"><Upload size={16} className="mr-1" /> {busy ? "Uploading..." : "Upload"}</Button>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.length === 0 && <div className="col-span-full p-8 text-center text-muted-foreground bg-gradient-card border border-border rounded-xl">No media yet.</div>}
        {items.map((m) => (
          <div key={m.id} className="bg-gradient-card border border-border rounded-xl overflow-hidden group">
            {m.mime_type?.startsWith("image/")
              ? <img src={m.url} alt={m.name} className="w-full aspect-square object-cover" />
              : <div className="w-full aspect-square flex items-center justify-center text-muted-foreground text-xs p-2 text-center">{m.mime_type}</div>}
            <div className="p-3 space-y-2">
              <div className="text-xs truncate" title={m.name}>{m.name}</div>
              <div className="flex gap-1">
                <Button size="icon" variant="ghost" onClick={() => copy(m.url)}><Copy size={12} /></Button>
                <Button size="icon" variant="ghost" onClick={() => remove(m)}><Trash2 size={12} /></Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MediaAdmin;
