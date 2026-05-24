import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface Page {
  id: string; slug: string; title: string; content: string;
  seo_title: string | null; seo_description: string | null; status: string;
}

const blank: Page = { id: "", slug: "", title: "", content: "", seo_title: "", seo_description: "", status: "draft" };

const PagesAdmin = () => {
  const [items, setItems] = useState<Page[]>([]);
  const [editing, setEditing] = useState<Page | null>(null);
  const [open, setOpen] = useState(false);

  const load = async () => {
    const { data } = await supabase.from("pages").select("*").order("created_at", { ascending: false });
    setItems((data as Page[]) || []);
  };
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!editing) return;
    const payload = { slug: editing.slug, title: editing.title, content: editing.content, seo_title: editing.seo_title, seo_description: editing.seo_description, status: editing.status };
    const { error } = editing.id
      ? await supabase.from("pages").update(payload).eq("id", editing.id)
      : await supabase.from("pages").insert(payload);
    if (error) return toast.error(error.message);
    toast.success("Saved"); setOpen(false); load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this page?")) return;
    const { error } = await supabase.from("pages").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted"); load();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-3xl font-serif font-bold">Pages</h1><p className="text-muted-foreground">Static pages of your site.</p></div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button onClick={() => setEditing({ ...blank })} className="bg-gradient-gold text-primary-foreground"><Plus size={16} className="mr-1" /> New Page</Button></DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{editing?.id ? "Edit Page" : "New Page"}</DialogTitle></DialogHeader>
            {editing && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div><Label>Title</Label><Input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} /></div>
                  <div><Label>Slug</Label><Input value={editing.slug} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} /></div>
                </div>
                <div><Label>Content</Label><Textarea rows={8} value={editing.content} onChange={(e) => setEditing({ ...editing, content: e.target.value })} /></div>
                <div><Label>SEO Title</Label><Input value={editing.seo_title || ""} onChange={(e) => setEditing({ ...editing, seo_title: e.target.value })} /></div>
                <div><Label>SEO Description</Label><Textarea rows={2} value={editing.seo_description || ""} onChange={(e) => setEditing({ ...editing, seo_description: e.target.value })} /></div>
                <div><Label>Status</Label>
                  <Select value={editing.status} onValueChange={(v) => setEditing({ ...editing, status: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="draft">Draft</SelectItem><SelectItem value="published">Published</SelectItem></SelectContent>
                  </Select>
                </div>
                <Button onClick={save} className="w-full">Save</Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
      <div className="bg-gradient-card border border-border rounded-xl divide-y divide-border">
        {items.length === 0 && <div className="p-8 text-center text-muted-foreground">No pages yet.</div>}
        {items.map((p) => (
          <div key={p.id} className="flex items-center justify-between p-4">
            <div>
              <div className="font-medium">{p.title} <span className="text-xs ml-2 px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">{p.status}</span></div>
              <div className="text-xs text-muted-foreground">/{p.slug}</div>
            </div>
            <div className="flex gap-2">
              <Button size="icon" variant="ghost" onClick={() => { setEditing(p); setOpen(true); }}><Pencil size={14} /></Button>
              <Button size="icon" variant="ghost" onClick={() => remove(p.id)}><Trash2 size={14} /></Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PagesAdmin;
