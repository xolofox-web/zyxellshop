"use client";

import { useState } from "react";
import { Search, PackageOpen } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const categories = ["Semua", "Favorit", "Terbaru", "Populer", "Rekomendasi"];

export default function CatalogPage() {
  const [active, setActive] = useState("Semua");
  const [query, setQuery] = useState("");

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Katalog</h1>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Jelajahi koleksi yang tersedia.
        </p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
        <Input
          placeholder="Cari koleksi..."
          className="pl-10"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={cn(
              "whitespace-nowrap rounded-full border px-4 py-1.5 text-xs font-medium transition-all",
              active === cat
                ? "border-slate-900 bg-slate-900 text-white dark:border-white dark:bg-white dark:text-slate-900"
                : "border-[var(--border)] text-[var(--muted)] hover:bg-slate-100 dark:hover:bg-slate-800"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--border)] py-20 text-center">
        <PackageOpen className="h-12 w-12 text-[var(--muted)]" />
        <h2 className="mt-4 font-semibold">Belum Ada Konten</h2>
        <p className="mt-1 max-w-xs text-sm text-[var(--muted)]">
          Koleksi akan segera hadir. Silakan kembali lagi nanti.
        </p>
      </div>
    </div>
  );
}