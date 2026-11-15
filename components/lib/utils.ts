// lib/utils.ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Menggabungkan class Tailwind dengan aman.
 * - `clsx` menangani conditional class (array, object, falsy, dll.)
 * - `twMerge` menyelesaikan konflik antar class Tailwind
 *   (mis. "px-2 px-4" → "px-4", "bg-red-500 bg-blue-500" → "bg-blue-500")
 *
 * @example
 * cn("px-2 py-1", isActive && "bg-purple-500", "px-4")
 * // => "py-1 bg-purple-500 px-4"
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format angka ke string Rupiah.
 *
 * @example
 * formatRupiah(50000)        // "Rp 50.000"
 * formatRupiah(54200)        // "Rp 54.200"
 * formatRupiah(1500, false)  // "1.500"
 */
export function formatRupiah(value: number, withPrefix = true): string {
  const formatted = new Intl.NumberFormat("id-ID", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);

  return withPrefix ? `Rp ${formatted}` : formatted;
}

/**
 * Format tanggal ke format Indonesia.
 *
 * @example
 * formatDate("2026-11-16T10:30:00Z")
 * // => "16 Nov 2026, 17.30"
 */
export function formatDate(
  input: string | Date,
  opts?: Intl.DateTimeFormatOptions
): string {
  const date = typeof input === "string" ? new Date(input) : input;
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    ...opts,
  }).format(date);
}

/**
 * Sleep helper untuk kebutuhan async/delay.
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}