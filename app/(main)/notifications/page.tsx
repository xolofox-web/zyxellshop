"use client";

import { useNotifications } from "@/hooks/use-notifications";
import { Bell, CheckCheck, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotificationsPage() {
  const { notifications, unreadCount, loading, markAllRead, remove } =
    useNotifications();

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-20 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Notifikasi</h1>
          <p className="text-sm text-[var(--muted)]">
            {unreadCount > 0
              ? `${unreadCount} belum dibaca`
              : "Semua sudah dibaca"}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" onClick={markAllRead} className="text-xs">
            <CheckCheck className="mr-1 h-4 w-4" />
            Tandai Semua
          </Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-[var(--border)] py-16 text-center">
          <Bell className="h-10 w-10 text-[var(--muted)]" />
          <p className="mt-3 text-sm text-[var(--muted)]">
            Tidak ada notifikasi.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`flex items-start gap-3 rounded-2xl border p-4 transition-colors ${
                n.is_read
                  ? "border-[var(--border)]"
                  : "border-brand-purple/30 bg-brand-purple/5"
              }`}
            >
              <div className="flex-1">
                <p className="text-sm font-medium">{n.title}</p>
                <p className="mt-0.5 text-xs text-[var(--muted)]">{n.message}</p>
              </div>
              <button
                onClick={() => remove(n.id)}
                className="rounded-lg p-1 text-[var(--muted)] hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}