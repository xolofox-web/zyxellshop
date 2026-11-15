"use client";

import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CartPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center animate-in fade-in zoom-in-95 duration-500">
      <div className="rounded-full bg-slate-100 p-6 dark:bg-slate-800">
        <ShoppingCart className="h-14 w-14 text-[var(--muted)]" />
      </div>
      <h1 className="mt-6 text-xl font-semibold">Keranjang Kosong</h1>
      <p className="mt-1 max-w-xs text-sm text-[var(--muted)]">
        Belum ada item di keranjang Anda.
      </p>
      <Link href="/catalog" className="mt-6">
        <Button variant="primary">Kembali ke Katalog</Button>
      </Link>
    </div>
  );
}