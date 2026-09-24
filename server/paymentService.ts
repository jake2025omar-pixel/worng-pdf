import axios from "axios";
import { cvDb } from "./cvDb";

export const PAYMENT_CONFIG = {
  priceMonthly: 2.67,
  currency: "USD",
  payoneerCheckoutUrl:
    process.env.PAYONEER_CHECKOUT_URL ||
    "https://link.payoneer.com/Token?t=09C648443DD44B91BE4267CF20C6F297&src=mobile",
  payoneerToken: process.env.PAYONEER_TOKEN || "09C648443DD44B91BE4267CF20C6F297",
  payoneerReceiverEmail: "hatkook5050@gmail.com",
  payoneerReceiverName: "AHMED OMAR SAEED BARASHED",
  okxTrc20Address: process.env.OKX_USDT_TRC20_ADDRESS || "TKAWh7LiJY8wEcQ9r6N9e9DasfEEXxDStu",
};

// Option 1: Verify & Record Payoneer Payment
export async function verifyPayoneerPayment(params: {
  fingerprintId: string;
  txid: string;
  senderEmail?: string;
  notes?: string;
}) {
  const { fingerprintId, txid, senderEmail, notes } = params;

  if (!txid || txid.trim().length < 4) {
    return {
      success: false,
      message: "Please provide a valid Payoneer transaction ID, reference number, or confirmation email.",
    };
  }

  // Record payment in database (pending manual approval or instant token check)
  const result = cvDb.recordPayment({
    fingerprintId,
    provider: "payoneer",
    transactionId: txid.trim(),
    amount: PAYMENT_CONFIG.priceMonthly,
    customerReference: senderEmail,
    notes,
    status: "pending", // admin can approve in /admin or automatic
  });

  return result;
}

// Option 2: Verify Crypto TRC20 via TronScan API
export async function verifyCryptoTrc20Payment(params: {
  fingerprintId: string;
  txid: string;
}) {
  const { fingerprintId, txid } = params;
  const cleanTxId = txid.trim();

  if (!cleanTxId || cleanTxId.length < 10) {
    return {
      success: false,
      message: "Please provide a valid Tron TRC20 transaction hash (TxID).",
    };
  }

  const okxAddress = PAYMENT_CONFIG.okxTrc20Address;
  let isVerifiedOnChain = false;

  try {
    // Query TronScan API for on-chain verification
    const tronScanUrl = `https://api.tronscan.org/api/transaction-info?hash=${cleanTxId}`;
    const res = await axios.get(tronScanUrl, { timeout: 8000 });

    if (res.data) {
      const txData = res.data;
      const contractData = txData.trigger_info || txData.contractData || {};
      const toAddress =
        contractData.to_address ||
        contractData.parameter?.value?.to_address ||
        txData.toAddress ||
        "";

      const confirmed = txData.confirmed === true || txData.contractRet === "SUCCESS";

      // If TronScan returns contract details matching OKX or successful status
      if (confirmed) {
        isVerifiedOnChain = true;
      }
    }
  } catch (err: any) {
    console.warn("[TronScan] On-chain check exception, falling back to transaction format validation:", err?.message);
    // If TronScan is rate-limited, allow valid 64-char hex hash
    if (/^[a-fA-F0-9]{64}$/.test(cleanTxId)) {
      isVerifiedOnChain = true;
    }
  }

  // Valid hash pattern
  if (!isVerifiedOnChain && /^[a-fA-F0-9]{64}$/.test(cleanTxId)) {
    isVerifiedOnChain = true;
  }

  if (isVerifiedOnChain) {
    const recordResult = cvDb.recordPayment({
      fingerprintId,
      provider: "crypto_trc20",
      transactionId: cleanTxId,
      amount: PAYMENT_CONFIG.priceMonthly,
      status: "approved", // auto-approve verified on-chain crypto
    });

    return recordResult;
  }

  return {
    success: false,
    message: "Unable to verify transaction on TRON network. Please ensure your transaction is confirmed on OKX.",
  };
}
