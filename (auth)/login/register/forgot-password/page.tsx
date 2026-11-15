"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ForgotPasswordPage() {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Redirect ke halaman update-password setelah user klik link di email
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${location.origin}/auth/callback?next=/update-password`,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
    }
  }

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 text-center">
        <div className="w-full max-w-sm space-y-4">
          <h1 className="text-xl font-semibold">Cek Email Anda</h1>
          <p className="text-sm text-[var(--muted)]">
            Kami telah mengirim tautan untuk mereset password ke <strong>{email}</strong>.
            Silakan klik tautan tersebut.
          </p>
          <Link href="/login">
            <Button variant="outline" className="w-full">Kembali ke Login</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Lupa Password</h1>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Masukkan email Anda untuk menerima tautan reset.
          </p>
        </div>

        <form onSubmit={handleReset} className="space-y-4">
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
          Ingat password Anda?{" "}
          <Link href="/login" className="font-medium text-brand-purple">
            Masuk
          </Link>
        </p>
      </div>
    </div>
  );
}