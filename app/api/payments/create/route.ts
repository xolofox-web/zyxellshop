import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createCashiTransaction } from "@/lib/cashi";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const {
    amount,
    payment_method,
    bank,
    retail,
  }: {
    amount: number;
    payment_method: "QRIS" | "VA" | "RETAIL";
    bank?: string;
    retail?: string;
  } = body;

  if (!amount || amount < 10_000) {
    return NextResponse.json(
      { error: "Jumlah minimal Rp 10.000" },
      { status: 400 }
    );
  }

  const orderId = `ZYX-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)
    .toUpperCase()}`;

  // Buat baris order awal (status PENDING)
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: user.id,
      order_id: orderId,
      amount,
      total_amount: amount, // sementara, akan diupdate dari respons cashi
      payment_method,
      status: "PENDING",
    })
    .select()
    .single();

  if (orderError || !order) {
    return NextResponse.json(
      { error: orderError?.message ?? "Gagal membuat order" },
      { status: 500 }
    );
  }

  try {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL!;

    const cashiRes = await createCashiTransaction({
      order_id: orderId,
      amount,
      payment_method,
      customer_name: user.email?.split("@")[0],
      customer_email: user.email,
      bank,
      retail,
      callback_url: `${siteUrl}/api/webhooks/cashi`,
      return_url: `${siteUrl}/checkout/${order.id}`,
    });

    // Update order dengan total_amount & admin_fee dari provider
    await supabase
      .from("orders")
      .update({
        total_amount: cashiRes.total_amount ?? amount,
        admin_fee: cashiRes.admin_fee ?? 0,
      })
      .eq("id", order.id);

    // Log transaksi
    await supabase.from("transactions").insert({
      order_id: order.id,
      external_id: cashiRes.orderId ?? null,
      payment_method,
      provider_response: cashiRes as unknown as Record<string, unknown>,
      status: "PENDING",
    });

    return NextResponse.json({
      success: true,
      order: { ...order, total_amount: cashiRes.total_amount ?? amount },
      payment: cashiRes,
    });
  } catch (err) {
    await supabase
      .from("orders")
      .update({ status: "FAILED" })
      .eq("id", order.id);

    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Gagal membuat transaksi" },
      { status: 502 }
    );
  }
                                         }
