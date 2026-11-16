"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ForgotPasswordPage() {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${location.origin}/auth/callback?next=/reset-password`,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
    } else {
      setSent(true);
    }
  }

  if (sent) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 text-center">
        <div className="max-w-sm space-y-3">
          <h1 className="text-xl font-semibold">Cek Email Anda</h1>
          <p className="text-sm text-[var(--muted)]">
            Jika <strong>{email}</strong> terdaftar, kami telah mengirim tautan
            untuk mengatur ulang kata sandi. Tautan berlaku 60 menit.
          </p>
          <Link
            href="/login"
            className="inline-block text-sm font-medium text-brand-purple"
          >
            Kembali ke Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">
            Lupa Kata Sandi<span className="text-brand-purple">.</span>
          </h1>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Masukkan email Anda, kami akan mengirim tautan reset.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {error && <p className="text-xs text-red-500">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Mengirim..." : "Kirim Tautan Reset"}
          </Button>
        </form>

        <p className="text-center text-xs text-[var(--muted)]">
          Ingat password?{" "}
          <Link href="/login" className="font-medium text-brand-purple">
            Masuk
          </Link>
        </p>
      </div>
    </div>
  );
}
