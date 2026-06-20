import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const ADMIN_EMAIL = "shinhasarder2343@gmail.com";
const ADMIN_ALIASES: Record<string, string> = {
  shinhasarder2343: "shinhasarder2343@gmail.com",
  mdshinhasarder466: "mdshinhasarder466@gmail.com",
};

const Auth = () => {
  const nav = useNavigate();
  const { user, isAdmin, loading, signOut } = useAuth();
  const [email, setEmail] = useState(ADMIN_EMAIL);
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (loading || !user) return;
    if (isAdmin) {
      nav("/admin", { replace: true });
      return;
    }
    signOut().then(() => toast.error("Admin access required."));
  }, [user, isAdmin, loading, nav, signOut]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      const trimmed = email.trim().toLowerCase();
      const loginEmail = ADMIN_ALIASES[trimmed] || trimmed;
      const { error } = await supabase.auth.signInWithPassword({ email: loginEmail, password });
      if (error) throw error;
      const { data: verified, error: userError } = await supabase.auth.getUser();
      if (userError || !verified.user) throw userError || new Error("Could not verify this session.");
      const { data: roleRow, error: roleError } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", verified.user.id)
        .eq("role", "admin")
        .maybeSingle();
      if (roleError) throw roleError;
      if (!roleRow) {
        await supabase.auth.signOut();
        throw new Error("This account is not an admin.");
      }
      toast.success("Signed in successfully. Opening admin dashboard...");
      nav("/admin", { replace: true });
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
          <Input type="text" inputMode="email" autoComplete="username" required value={email} onChange={(e) => setEmail(e.target.value)} />
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
