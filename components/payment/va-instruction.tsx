"use client";

export function VaInstruction({ payment }: { payment: Record<string, any> }) {
  return (
    <div className="space-y-4 rounded-2xl border border-[var(--border)] p-6">
      <h2 className="text-center font-semibold">Virtual Account {payment.bank}</h2>

      <div className="rounded-xl bg-slate-100 p-4 text-center dark:bg-slate-800">
        <p className="text-xs text-[var(--muted)]">Nomor Virtual Account</p>
        <p className="mt-1 text-xl font-bold tracking-wider">
          {payment.va_number}
        </p>
      </div>

      <ol className="list-decimal space-y-2 pl-5 text-sm text-[var(--muted)]">
        <li>Buka aplikasi m-banking atau ATM {payment.bank}.</li>
        <li>Pilih menu Transfer / Virtual Account.</li>
        <li>Masukkan nomor VA di atas.</li>
        <li>Masukkan nominal sesuai total pembayaran.</li>
        <li>Konfirmasi dan simpan bukti transfer.</li>
      </ol>
    </div>
  );
}