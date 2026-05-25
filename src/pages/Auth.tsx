import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const ADMIN_EMAIL = "shinhasarder2343@gmail.com";
const ADMIN_PASS = "shinha9900";

const Auth = () => {
  const nav = useNavigate();
  const { user, loading } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState(ADMIN_EMAIL);
  const [password, setPassword] = useState(ADMIN_PASS);
  const [busy, setBusy] = useState(false);

  useEffect(() => { if (!loading && user) nav("/admin"); }, [user, loading, nav]);

  const trySignIn = async (em: string, pw: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email: em, password: pw });
    return error;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${window.location.origin}/admin` } });
        if (error) throw error;
        const signInErr = await trySignIn(email, password);
        if (signInErr) { toast.success("Account created. Please sign in."); setMode("signin"); }
        else { toast.success("Welcome!"); nav("/admin"); }
      } else {
        let err = await trySignIn(email, password);
        if (err && email === ADMIN_EMAIL && password === ADMIN_PASS) {
          const { error: suErr } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${window.location.origin}/admin` } });
          if (suErr) throw suErr;
          err = await trySignIn(email, password);
        }
        if (err) throw err;
        nav("/admin");
      }
    } catch (err: any) { toast.error(err.message); }
    finally { setBusy(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <form onSubmit={submit} className="w-full max-w-md bg-gradient-card rounded-2xl p-8 border border-border shadow-card space-y-5">
        <h1 className="text-2xl font-serif font-bold text-gradient-gold">{mode === "signin" ? "Admin Sign In" : "Create Account"}</h1>
        <p className="text-sm text-muted-foreground">Pre-filled with admin credentials — just click Sign In.</p>
        <div className="space-y-2">
          <Label>Email</Label>
          <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Password</Label>
          <Input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <Button type="submit" disabled={busy} className="w-full bg-gradient-gold text-primary-foreground">
          {busy ? "Please wait..." : mode === "signin" ? "Sign In" : "Sign Up"}
        </Button>
        <button type="button" onClick={() => setMode(mode === "signin" ? "signup" : "signin")} className="text-sm text-primary hover:underline w-full">
          {mode === "signin" ? "Need an account? Sign up" : "Have an account? Sign in"}
        </button>
      </form>
    </div>
  );
};

export default Auth;
