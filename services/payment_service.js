// WORNG PDF - Payment Service (NO GUMROAD - YEMEN COMPATIBLE)
// Payoneer Account: hatkook5050@gmail.com (AHMED OMAR SAEED BARASHED)
// OKX USDT TRC20: TKAWh7LiJY8wEcQ9r6N9e9DasfEEXxDStu

export const PAYONEER_CHECKOUT_URL = "https://link.payoneer.com/Token?t=09C648443DD44B91BE4267CF20C6F297&src=mobile";
export const OKX_USDT_TRC20_ADDRESS = "TKAWh7LiJY8wEcQ9r6N9e9DasfEEXxDStu";
export const SUBSCRIPTION_MONTHLY_PRICE = 2.67;

export function openPayoneerCheckout() {
  if (typeof window !== "undefined") {
    window.open(PAYONEER_CHECKOUT_URL, "_blank");
  }
}
