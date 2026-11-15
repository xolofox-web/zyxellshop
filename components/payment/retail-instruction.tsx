"use client";

export function RetailInstruction({
  payment,
}: {
  payment: Record<string, any>;
}) {
  return (
    <div className="space-y-4 rounded-2xl border border-[var(--border)] p-6">
      <h2 className="text-center font-semibold">
        Pembayaran di {payment.retail_name ?? "Retail"}
      </h2>

      <div className="rounded-xl bg-slate-100 p-4 text-center dark:bg-slate-800">
        <p className="text-xs text-[var(--muted)]">Kode Pembayaran</p>
        <p className="mt-1 text-xl font-bold tracking-wider">
          {payment.payment_code}
        </p>
      </div>

      <ol className="list-decimal space-y-2 pl-5 text-sm text-[var(--muted)]">
        <li>Datang ke kasir {payment.retail_name} terdekat.</li>
        <li>
          Sebutkan ingin membayar pesanan dengan kode{" "}
          <strong>{payment.payment_code}</strong>.
        </li>
        <li>Bayar sesuai total tagihan.</li>
        <li>Simpan struk sebagai bukti.</li>
      </ol>
    </div>
  );
}