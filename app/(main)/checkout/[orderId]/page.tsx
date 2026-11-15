import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { QrisInstruction } from "@/components/payment/qris-instruction";
import { VaInstruction } from "@/components/payment/va-instruction";
import { RetailInstruction } from "@/components/payment/retail-instruction";

export default async function PaymentInstructionPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;
  const supabase = await createClient();

  const { data: order } = await supabase
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .single();

  if (!order) notFound();

  // Ambil respons provider terakhir
  const { data: tx } = await supabase
    .from("transactions")
    .select("provider_response")
    .eq("order_id", order.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  const payment = tx?.provider_response as Record<string, any> | undefined;

  return (
    <div className="mx-auto max-w-md space-y-6">
      <div className="rounded-2xl border border-[var(--border)] p-6 text-center">
        <p className="text-xs text-[var(--muted)]">Total Pembayaran</p>
        <p className="mt-1 text-2xl font-bold">
          Rp {Number(order.total_amount).toLocaleString("id-ID")}
        </p>
        <p className="mt-1 text-xs text-[var(--muted)]">
          Order: {order.order_id}
        </p>
        <span className="mt-3 inline-block rounded-full bg-slate-100 px-3 py-1 text-xs font-medium dark:bg-slate-800">
          {order.status}
        </span>
      </div>

      {order.payment_method === "QRIS" && payment && (
        <QrisInstruction payment={payment} />
      )}
      {order.payment_method === "VA" && payment && (
        <VaInstruction payment={payment} />
      )}
      {order.payment_method === "RETAIL" && payment && (
        <RetailInstruction payment={payment} />
      )}
    </div>
  );
}