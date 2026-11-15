"use client";

export function QrisInstruction({ payment }: { payment: Record<string, any> }) {
  return (
    <div className="space-y-4 rounded-2xl border border-[var(--border)] p-6 text-center">
      <h2 className="font-semibold">Scan QRIS</h2>
      <p className="text-sm text-[var(--muted)]">
        Buka aplikasi e-wallet atau m-banking, lalu scan kode di bawah.
      </p>

      {payment.qr_url ? (
        <img
          src={payment.qr_url}
          alt="QRIS"
          className="mx-auto h-56 w-56 rounded-xl border border-[var(--border)] object-contain p-2"
        />
      ) : payment.qr_string ? (
        <div className="mx-auto flex h-56 w-56 items-center justify-center rounded-xl bg-slate-100 text-xs dark:bg-slate-800">
          QR string tersedia — render dengan library QR
        </div>
      ) : null}

      {payment.expires_at && (
        <p className="text-xs text-[var(--muted)]">
          Berlaku hingga: {payment.expires_at}
        </p>
      )}
    </div>
  );
}