// lib/types-payment.ts

export type PaymentMethod = "QRIS" | "VA" | "RETAIL";

export type PaymentStatus = "PENDING" | "SETTLED" | "EXPIRED" | "FAILED";

export interface Order {
  id: string;
  user_id: string;
  order_id: string; // ID unik merchant, mis. ZYX-1712345678-AB12CD
  amount: number;
  admin_fee: number;
  total_amount: number;
  payment_method: PaymentMethod;
  status: PaymentStatus;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  order_id: string; // FK ke orders.id (uuid)
  external_id: string | null; // orderId dari cashi.id
  payment_method: PaymentMethod;
  provider_response: Record<string, unknown> | null;
  status: PaymentStatus;
  created_at: string;
}

/**
 * Respons dari endpoint create transaction cashi.id.
 * Field tidak semuanya ada — tergantung `payment_method`:
 *  - QRIS   -> qr_string / qr_url
 *  - VA     -> va_number, bank, bank_name
 *  - RETAIL -> payment_code, retail_code, retail_name
 */
export interface CashiCreateResponse {
  success: boolean;
  message?: string;

  // Umum
  orderId?: string;
  amount?: number;
  admin_fee?: number;
  total_amount?: number;
  expected_net?: number;
  expires_at?: string;
  provider?: "QRIS" | "VA" | "RETAIL" | string;
  kode_channel?: string;

  // QRIS
  qr_string?: string;
  qr_url?: string;

  // Virtual Account
  va_number?: string;
  bank?: string;
  bank_name?: string;

  // Retail
  payment_code?: string;
  retail_code?: string;
  retail_name?: string;
}

/**
 * Payload webhook dari cashi.id (sesuai contoh di spesifikasi).
 * Signature dikirim lewat header `x-gateway-signature` (HMAC-SHA256).
 */
export interface CashiWebhookPayload {
  event: "PAYMENT_SETTLED" | string;
  data: {
    order_id: string;
    status: "SETTLED" | "PENDING" | "EXPIRED" | "FAILED" | string;
    amount?: number;
    total_amount?: number;
    payment_method?: PaymentMethod;
    [key: string]: unknown;
  };
}

/** Body request ke POST /api/payments/create */
export interface CreatePaymentRequest {
  amount: number;
  payment_method: PaymentMethod;
  bank?: string;   // wajib jika payment_method === "VA"
  retail?: string; // wajib jika payment_method === "RETAIL"
}

/** Respons sukses dari POST /api/payments/create */
export interface CreatePaymentResponse {
  success: true;
  order: Order;
  payment: CashiCreateResponse;
}