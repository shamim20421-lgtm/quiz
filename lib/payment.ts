import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

export const BKASH_PAYMENT_NUMBER = "01953121121";
export const PAYMENT_CURRENCY = "BDT";
export const REGULAR_PAYMENT_AMOUNT = 399;
export const LAUNCH_PAYMENT_AMOUNT = 199;
export const LAUNCH_VERIFIED_LIMIT = 50;

export type PaymentStatus = "pending" | "verified" | "rejected";

export async function getCurrentPaymentAmount(client: SupabaseClient) {
  const { count, error } = await client
    .from("payments")
    .select("id", { count: "exact", head: true })
    .eq("status", "verified");

  if (error) {
    console.error("verified payment count failed", error);
    return LAUNCH_PAYMENT_AMOUNT;
  }

  return (count ?? 0) < LAUNCH_VERIFIED_LIMIT ? LAUNCH_PAYMENT_AMOUNT : REGULAR_PAYMENT_AMOUNT;
}

export function normalizeTrxId(value: string) {
  return value.trim().toUpperCase();
}
