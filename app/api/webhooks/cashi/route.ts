import { NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // service role, karena webhook tidak punya sesi user
);

export async function POST(request: Request) {
  const signature = request.headers.get("x-gateway-signature");

  if (!signature) {
    return new NextResponse("Missing signature", { status: 401 });
  }

  const rawBody = await request.text();

  const expected = crypto
    .createHmac("sha256", process.env.CASHI_WEBHOOK_SECRET!)
    .update(rawBody)
    .digest("hex");

  if (signature !== expected) {
    return new NextResponse("Invalid signature", { status: 401 });
  }

  let payload: {
    event: string;
    data: {
      order_id: string;
      status: string;
      amount?: number;
      total_amount?: number;
      payment_method?: string;
      [key: string]: unknown;
    };
  };

  try {
    payload = JSON.parse(rawBody);
  } catch {
    return new NextResponse("Invalid JSON", { status: 400 });
  }

  const { event, data } = payload;

  if (event !== "PAYMENT_SETTLED") {
    return NextResponse.json({ message: "Event ignored" });
  }

  // Abaikan test order
  if (data.order_id?.startsWith("TEST-")) {
    return NextResponse.json({ message: "Test OK" });
  }

  if (data.status !== "SETTLED") {
    return NextResponse.json({ message: "Not settled" });
  }

  // Cari order berdasarkan merchant order_id
  const { data: order } = await supabaseAdmin
    .from("orders")
    .select("id, status")
    .eq("order_id", data.order_id)
    .single();

  if (!order) {
    return new NextResponse("Order not found", { status: 404 });
  }

  // Idempoten: jika sudah lunas, skip
  if (order.status === "SETTLED") {
    return NextResponse.json({ message: "Already settled" });
  }

  await supabaseAdmin
    .from("orders")
    .update({
      status: "SETTLED",
      total_amount: data.total_amount ?? undefined,
    })
    .eq("id", order.id);

  await supabaseAdmin
    .from("transactions")
    .update({ status: "SETTLED" })
    .eq("order_id", order.id)
    .eq("status", "PENDING");

  // Opsional: kirim notifikasi ke user
  await supabaseAdmin.from("notifications").insert({
    user_id: (
      await supabaseAdmin
        .from("orders")
        .select("user_id")
        .eq("id", order.id)
        .single()
    ).data?.user_id,
    title: "Pembayaran Berhasil",
    message: `Pesanan ${data.order_id} telah dibayar.`,
  });

  return NextResponse.json({ message: "OK" });
}