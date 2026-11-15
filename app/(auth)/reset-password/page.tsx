"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ResetPasswordPage() {
  const supabase = createClient();
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [ready, setReady] = useState(false);
  const [done, setDone] = useState(false);

  // Supabase SSR menaruh session di cookie setelah /auth/callback.
  // Pastikan user sedang punya sesi recovery sebelum menampilkan form.
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setReady(true);
      else router.replace("/forgot-password");
    });
  }, [router, supabase]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password minimal 6 karakter");
      return;
    }
    if (password !== confirm) {
      setError("Konfirmasi password tidak cocok");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setDone(true);
    // Setelah 1.5 detik arahkan ke home
    setTimeout(() => {
      router.push("/");
      router.refresh();
    }, 1500);
  }

  if (done) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 text-center">
        <div className="max-w-sm space-y-3">
          <h1 className="text-xl font-semibold">Kata Sandi Diperbarui</h1>
          <p className="text-sm text-[var(--muted)]">
            Anda akan diarahkan ke beranda...
          </p>
        </div>
      </div>
    );
  }

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <p className="text-sm text-[var(--muted)]">Memverifikasi tautan...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">
            Atur Ulang Kata Sandi<span className="text-brand-purple">.</span>
          </h1>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Masukkan kata sandi baru Anda.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="password"
            placeholder="Password baru (min. 6 karakter)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={6}
            required
          />
          <Input
            type="password"
            placeholder="Konfirmasi password baru"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            minLength={6}
            required
          />
          {error && <p className="text-xs text-red-500">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Menyimpan..." : "Simpan Kata Sandi Baru"}
          </Button>
        </form>

        <p className="text-center text-xs text-[var(--muted)]">
          Batal?{" "}
          <Link href="/login" className="font-medium text-brand-purple">
            Kembali ke Login
          </Link>
        </p>
      </div>
    </div>
  );
}