"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const supabase = createClient();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      router.push("/");
      router.refresh();
    }
  }

  async function handleGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${location.origin}/auth/callback` },
    });
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">
            Masuk ke ZYXELL<span className="text-brand-purple">.</span>
          </h1>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Selamat datang kembali.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p className="text-xs text-red-500">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Masuk..." : "Masuk"}
          </Button>
        </form>

        <div className="relative text-center">
          <span className="bg-[var(--background)] px-2 text-xs text-[var(--muted)]">
            atau
          </span>
        </div>

        <Button variant="outline" className="w-full" onClick={handleGoogle}>
          Masuk dengan Google
        </Button>

        <p className="text-center text-xs text-[var(--muted)]">
          Belum punya akun?{" "}
          <Link href="/register" className="font-medium text-brand-purple">
            Daftar
          </Link>
        </p>
      </div>
    </div>
  );
}