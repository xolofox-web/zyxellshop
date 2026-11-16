// lib/cashi.ts

import type { CashiCreateResponse, PaymentMethod } from "./types-payment";

const CASHI_BASE_URL =
  process.env.CASHI_BASE_URL ?? "https://api.cashi.id";

function cashiHeaders(): HeadersInit {
  const apiKey = process.env.CASHI_API_KEY;
  if (!apiKey) {
    throw new Error("CASHI_API_KEY belum diset di environment variable");
  }

  return {
    "Content-Type": "application/json",
    Accept: "application/json",
    "x-api-key": apiKey,
  };
}

export interface CreateCashiTransactionInput {
  order_id: string;        // merchant order id (unik)
  amount: number;          // nominal dasar
  payment_method: PaymentMethod;
  customer_name?: string;
  customer_email?: string;
  bank?: string;           // untuk VA, mis. "BCA"
  retail?: string;         // untuk RETAIL, mis. "ALFAMART"
  callback_url: string;    // URL webhook
  return_url: string;      // URL redirect setelah bayar
}

/**
 * Membuat transaksi baru di cashi.id.
 *
 * Catatan: path `/v1/transactions` dan nama field request
 * mengikuti pola umum payment gateway. Sesuaikan dengan
 * dokumentasi resmi cashi.id di dashboard merchant Anda.
 */
export async function createCashiTransaction(
  payload: CreateCashiTransactionInput
): Promise<CashiCreateResponse> {
  const body: Record<string, unknown> = {
    merchant_order_id: payload.order_id,
    amount: payload.amount,
    payment_method: payload.payment_method,
    customer: {
      name: payload.customer_name,
      email: payload.customer_email,
    },
    callback_url: payload.callback_url,
    return_url: payload.return_url,
  };

  if (payload.payment_method === "VA") {
    if (!payload.bank) {
      throw new Error("bank wajib diisi untuk metode VA");
    }
    body.bank = payload.bank;
  }

  if (payload.payment_method === "RETAIL") {
    if (!payload.retail) {
      throw new Error("retail wajib diisi untuk metode RETAIL");
    }
    body.retail = payload.retail;
  }

  let res: Response;
  try {
    res = await fetch(`${CASHI_BASE_URL}/v1/transactions`, {
      method: "POST",
      headers: cashiHeaders(),
      body: JSON.stringify(body),
    });
  } catch (err) {
    throw new Error(
      `Tidak dapat menghubungi cashi.id: ${
        err instanceof Error ? err.message : "unknown error"
      }`
    );
  }

  let data: CashiCreateResponse;
  try {
    data = (await res.json()) as CashiCreateResponse;
  } catch {
    throw new Error(`Respons cashi.id tidak valid (HTTP ${res.status})`);
  }

  if (!res.ok || !data.success) {
    throw new Error(
      data.message ?? `Gagal membuat transaksi (HTTP ${res.status})`
    );
  }

  return data;
}