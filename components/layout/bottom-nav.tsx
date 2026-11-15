"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Bell, LayoutGrid, ShoppingCart, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNotifications } from "@/hooks/use-notifications";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/notifications", label: "Notifikasi", icon: Bell },
  { href: "/catalog", label: "Katalog", icon: LayoutGrid },
  { href: "/cart", label: "Keranjang", icon: ShoppingCart },
  { href: "/profile", label: "Profil", icon: User },
];

export function BottomNav() {
  const pathname = usePathname();
  const { unreadCount } = useNotifications();

  return (
    <nav
      className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-1 rounded-full border border-[var(--border)] bg-[var(--background)] p-1.5 shadow-float md:bottom-8 md:gap-2 md:p-2"
      style={{ paddingBottom: "max(0.375rem, env(safe-area-inset-bottom))" }}
    >
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "relative flex h-11 w-11 items-center justify-center rounded-full transition-all duration-300 md:h-12 md:w-12",
              isActive
                ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                : "text-[var(--muted)] hover:bg-slate-100 dark:hover:bg-slate-800"
            )}
            aria-label={item.label}
          >
            <Icon className="h-5 w-5" />
            {item.href === "/notifications" && unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-pink px-1 text-[10px] font-bold text-white">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}