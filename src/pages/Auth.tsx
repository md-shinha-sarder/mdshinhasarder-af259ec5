import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const ADMIN_EMAIL = "shinhasarder2343@gmail.com";

const Auth = () => {
  const nav = useNavigate();
  const { user, loading } = useAuth();
  const [email, setEmail] = useState(ADMIN_EMAIL);
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => { if (!loading && user) nav("/admin"); }, [user, loading, nav]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      nav("/admin");
    } catch (err: any) {
      toast.error(err.message || "Sign in failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <form onSubmit={submit} className="w-full max-w-md bg-gradient-card rounded-2xl p-8 border border-border shadow-card space-y-5">
        <h1 className="text-2xl font-serif font-bold text-gradient-gold">Admin Sign In</h1>
        <p className="text-sm text-muted-foreground">Sign in with your admin credentials.</p>
        <div className="space-y-2">
          <Label>Email</Label>
          <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Password</Label>
          <Input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <Button type="submit" disabled={busy} className="w-full bg-gradient-gold text-primary-foreground">
          {busy ? "Please wait..." : "Sign In"}
        </Button>
      </form>
    </div>
  );
};

export default Auth;
