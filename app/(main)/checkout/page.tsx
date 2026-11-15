"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PaymentMethodSelector } from "@/components/payment/payment-method-selector";
import type { PaymentMethod } from "@/lib/types-payment";

export default function CheckoutPage() {
  const router = useRouter();
  const [amount, setAmount] = useState(50000);
  const [method, setMethod] = useState<PaymentMethod>("QRIS");
  const [bank, setBank] = useState("BCA");
  const [retail, setRetail] = useState("ALFAMART");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handlePay() {
    setLoading(true);
    setError("");

    const res = await fetch("/api/payments/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount,
        payment_method: method,
        bank: method === "VA" ? bank : undefined,
        retail: method === "RETAIL" ? retail : undefined,
      }),
    });

    const json = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(json.error ?? "Terjadi kesalahan");
      return;
    }

    router.push(`/checkout/${json.order.id}`);
  }

  return (
    <div className="mx-auto max-w-md space-y-6">
      <h1 className="text-2xl font-bold">Checkout</h1>

      <div className="space-y-1">
        <label className="text-xs font-medium text-[var(--muted)]">
          Jumlah (Rp)
        </label>
        <Input
          type="number"
          min={10000}
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
        />
      </div>

      <PaymentMethodSelector
        value={method}
        onChange={setMethod}
        bank={bank}
        onBankChange={setBank}
        retail={retail}
        onRetailChange={setRetail}
      />

      {error && <p className="text-xs text-red-500">{error}</p>}

      <Button onClick={handlePay} disabled={loading} className="w-full">
        {loading ? "Memproses..." : `Bayar Rp ${amount.toLocaleString("id-ID")}`}
      </Button>
    </div>
  );
}