"use client";

import Link from "next/link";
import { useUser } from "@/hooks/use-user";
import { ThemeToggle } from "@/components/theme-toggle";
import { User } from "lucide-react";

export function Header() {
  const { user, profile } = useUser();

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
        <Link href="/" className="text-xl font-bold tracking-tight">
          ZYXELL<span className="text-brand-purple">.</span>
        </Link>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            href="/profile"
            className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-[var(--border)] bg-slate-100 dark:bg-slate-800"
          >
            {profile?.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt="Avatar"
                className="h-full w-full object-cover"
              />
            ) : (
              <User className="h-5 w-5 text-[var(--muted)]" />
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}