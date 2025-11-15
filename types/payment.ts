export type BillingPeriod = "monthly" | "yearly";

export type Plan = {
  id: BillingPeriod;
  price: string;
  periodLabel: string;
  savingsTag?: string;
  headline: string;
  features: string[];
};

// types/payment.ts
export type PaymentMethodType = "paypal" | "google_pay" | "apple_pay" | "card";

export type PaymentMethod = {
  id: string;
  type: PaymentMethodType;
  label: string; // e.g. "Mastercard"
  description?: string; // e.g. "**** **** **** 4679"
  emailHint?: string; // for PayPal / GPay / Apple Pay
  brand?: string; // "Mastercard", "Visa", etc.
  isDefault?: boolean;
};
