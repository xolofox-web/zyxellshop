"use client";

import { cn } from "@/lib/utils";
import { QrCode, Building2, Store } from "lucide-react";
import type { PaymentMethod } from "@/lib/types-payment";

interface Props {
  value: PaymentMethod;
  onChange: (v: PaymentMethod) => void;
  bank: string;
  onBankChange: (v: string) => void;
  retail: string;
  onRetailChange: (v: string) => void;
}

const methods = [
  { id: "QRIS", label: "QRIS", icon: QrCode, desc: "Scan dengan e-wallet" },
  { id: "VA", label: "Virtual Account", icon: Building2, desc: "Transfer bank" },
  { id: "RETAIL", label: "Retail", icon: Store, desc: "Alfamart / Indomaret" },
] as const;

export function PaymentMethodSelector({
  value,
  onChange,
  bank,
  onBankChange,
  retail,
  onRetailChange,
}: Props) {
  return (
    <div className="space-y-3">
      {methods.map((m) => {
        const Icon = m.icon;
        const active = value === m.id;
        return (
          <button
            key={m.id}
            onClick={() => onChange(m.id)}
            className={cn(
              "flex w-full items-center gap-3 rounded-2xl border p-4 text-left transition-all",
              active
                ? "border-brand-purple bg-brand-purple/5"
                : "border-[var(--border)]"
            )}
          >
            <Icon
              className={cn(
                "h-5 w-5",
                active ? "text-brand-purple" : "text-[var(--muted)]"
              )}
            />
            <div className="flex-1">
              <p className="text-sm font-medium">{m.label}</p>
              <p className="text-xs text-[var(--muted)]">{m.desc}</p>
            </div>
          </button>
        );
      })}

      {value === "VA" && (
        <select
          value={bank}
          onChange={(e) => onBankChange(e.target.value)}
          className="w-full rounded-xl border border-[var(--border)] bg-transparent px-4 py-2.5 text-sm"
        >
          <option value="BCA">BCA</option>
          <option value="BNI">BNI</option>
          <option value="BRI">BRI</option>
          <option value="MANDIRI">Mandiri</option>
        </select>
      )}

      {value === "RETAIL" && (
        <select
          value={retail}
          onChange={(e) => onRetailChange(e.target.value)}
          className="w-full rounded-xl border border-[var(--border)] bg-transparent px-4 py-2.5 text-sm"
        >
          <option value="ALFAMART">Alfamart</option>
          <option value="INDOMARET">Indomaret</option>
        </select>
      )}
    </div>
  );
}