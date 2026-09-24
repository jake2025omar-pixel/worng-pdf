import React, { useState } from "react";
import { X, Check, Copy, ExternalLink, ShieldCheck, ArrowRight, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { getOrCreateFingerprint } from "@/lib/fingerprint";
import { OKX_USDT_TRC20_ADDRESS, SUBSCRIPTION_MONTHLY_PRICE, openPayoneerCheckout } from "@/services/payment_service";

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function SubscriptionModal({ isOpen, onClose, onSuccess }: SubscriptionModalProps) {
  const [activeTab, setActiveTab] = useState<"payoneer" | "crypto_trc20">("payoneer");
  const [transactionId, setTransactionId] = useState("");
  const [senderEmail, setSenderEmail] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);

  if (!isOpen) return null;

  const handleCopyTrc20 = () => {
    navigator.clipboard.writeText(OKX_USDT_TRC20_ADDRESS);
    setCopiedAddress(true);
    toast.success("OKX TRC20 Address copied to clipboard!");
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transactionId.trim()) {
      toast.error("Please enter your transaction ID, reference number, or TxHash.");
      return;
    }

    const fingerprint = getOrCreateFingerprint();
    setIsVerifying(true);

    try {
      const endpoint = activeTab === "payoneer" ? "/api/payments/verify-payoneer" : "/api/payments/verify-crypto";
      const payload = {
        fingerprint,
        txid: transactionId.trim(),
        senderEmail: senderEmail.trim() || undefined,
      };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Payment verification failed.");
      }

      toast.success(data.message || "Subscription activated successfully! Enjoy unlimited CVs.");
      onSuccess?.();
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Unable to verify transaction. Please check your transaction details.");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="max-w-xl w-full bg-[#FFFFFF] rounded-[36px] p-0 overflow-hidden shadow-[0_25px_70px_rgba(0,0,0,0.12)] border border-white">
        <div className="text-[#1A1A1A]">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-[#EDE7DE] bg-[#FFFFFF]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl clay-icon-circle bg-[#EDE7DE] flex items-center justify-center text-[#1A1A1A] shadow-xs">
                <Sparkles className="w-5 h-5 text-[#1A1A1A]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#E8C4C4] text-[#1A1A1A] uppercase tracking-wider">
                    Yemen Compatible · No Login
                  </span>
                  <span className="text-xs text-[#6B6B6B]">Cancel anytime</span>
                </div>
                <h2 className="text-xl font-black text-[#1A1A1A] mt-1">Unlock Unlimited AI CV Creation</h2>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-[#6B6B6B] hover:text-[#1A1A1A] hover:bg-[#F9F5EF] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Pricing Banner */}
          <div className="p-6 bg-[#F9F5EF] border-b border-[#EDE7DE]">
            <div className="flex items-baseline justify-between mb-4">
              <div>
                <p className="text-4xl font-black text-[#1A1A1A] tracking-tight">
                  ${SUBSCRIPTION_MONTHLY_PRICE} <span className="text-sm font-semibold text-[#6B6B6B]">/ month</span>
                </p>
                <p className="text-xs text-[#6B6B6B] mt-0.5">
                  First generation is 100% free. Subscribe for unlimited access.
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs text-[#1A1A1A] font-bold flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-[#1A1A1A]" /> 100% Guaranteed Pass
                </span>
              </div>
            </div>

            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#6B6B6B]">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#1A1A1A] shrink-0" />
                <span>Unlimited Dual Resumes (Arabic + English)</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#1A1A1A] shrink-0" />
                <span>All 6 Executive & ATS Templates</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#1A1A1A] shrink-0" />
                <span>Old CV & Image Scanner (Up to 20MB)</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#1A1A1A] shrink-0" />
                <span>10-Year Recruiter ATS Keyword Match</span>
              </li>
            </ul>
          </div>

          {/* Payment Methods (Payoneer Direct + OKX TRC20 ONLY) */}
          <div className="p-6">
            <label className="text-xs font-bold text-[#6B6B6B] uppercase tracking-wider block mb-3">
              Choose Direct Payment Method (Yemen Supported):
            </label>

            <div className="grid grid-cols-2 gap-3 mb-5">
              <button
                type="button"
                onClick={() => setActiveTab("payoneer")}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                  activeTab === "payoneer"
                    ? "bg-[#FFFFFF] border-[#1A1A1A] shadow-md text-[#1A1A1A]"
                    : "bg-[#F9F5EF] border-[#EDE7DE] text-[#6B6B6B] hover:text-[#1A1A1A]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold">Payoneer Link</p>
                  <span className="text-[10px] font-bold text-[#1A1A1A]">Direct</span>
                </div>
                <p className="text-[10px] text-[#6B6B6B] mt-1">Cards / Bank Transfer</p>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("crypto_trc20")}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                  activeTab === "crypto_trc20"
                    ? "bg-[#FFFFFF] border-[#1A1A1A] shadow-md text-[#1A1A1A]"
                    : "bg-[#F9F5EF] border-[#EDE7DE] text-[#6B6B6B] hover:text-[#1A1A1A]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold">OKX TRC20</p>
                  <span className="text-[10px] font-bold text-[#1A1A1A]">Instant</span>
                </div>
                <p className="text-[10px] text-[#6B6B6B] mt-1">USDT Tron Network</p>
              </button>
            </div>

            {/* Tab 1: Payoneer Direct Link */}
            {activeTab === "payoneer" && (
              <div className="p-4 rounded-2xl bg-[#F9F5EF] border border-[#EDE7DE] mb-5 text-xs text-[#6B6B6B] shadow-xs">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <p className="font-bold text-[#1A1A1A] text-sm">Payoneer Direct Payment</p>
                    <p className="text-[11px] text-[#6B6B6B]">
                      Recipient: <strong className="text-[#1A1A1A]">AHMED OMAR SAEED BARASHED</strong> (hatkook5050@gmail.com)
                    </p>
                  </div>
                  <span className="text-xs font-bold text-[#1A1A1A]">$2.67 USD</span>
                </div>
                <p className="text-[#6B6B6B] mb-3 text-[11px]">
                  Click below to open the official Payoneer payment link. Complete payment using your debit/credit card or Payoneer balance.
                </p>
                <button
                  type="button"
                  onClick={() => openPayoneerCheckout()}
                  className="w-full py-2.5 px-4 rounded-xl btn-clay-dark text-xs font-bold flex items-center justify-center gap-2 text-white shadow-xs cursor-pointer"
                >
                  <span>Open Payoneer Checkout Link</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Tab 2: OKX USDT TRC20 */}
            {activeTab === "crypto_trc20" && (
              <div className="p-4 rounded-2xl bg-[#F9F5EF] border border-[#EDE7DE] mb-5 text-xs text-[#6B6B6B] shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-bold text-[#1A1A1A] text-sm">OKX USDT TRC20 Wallet</p>
                  <span className="text-xs font-bold text-[#1A1A1A]">Exact: 2.67 USDT</span>
                </div>
                <p className="text-[#6B6B6B] text-[11px] mb-3">
                  Send <strong>$2.67 USDT</strong> via the <strong>TRC20 (Tron)</strong> network to this OKX deposit address:
                </p>

                <div className="flex items-center gap-2 bg-[#FFFFFF] p-3 rounded-xl border border-[#EDE7DE] font-mono text-[11px] text-[#1A1A1A] break-all mb-3 shadow-inner">
                  <span>{OKX_USDT_TRC20_ADDRESS}</span>
                  <button
                    type="button"
                    onClick={handleCopyTrc20}
                    className="p-1.5 rounded-lg bg-[#F9F5EF] hover:bg-[#EDE7DE] text-[#1A1A1A] ml-auto shrink-0 shadow-xs cursor-pointer"
                    title="Copy TRC20 address"
                  >
                    <Copy className="w-3.5 h-3.5 text-[#1A1A1A]" />
                  </button>
                </div>

                <div className="flex items-center justify-center p-3 bg-white rounded-xl max-w-[140px] mx-auto mb-2 border border-[#EDE7DE] shadow-xs">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=130x130&data=${OKX_USDT_TRC20_ADDRESS}`}
                    alt="OKX TRC20 QR Code"
                    className="w-24 h-24"
                  />
                </div>
                <p className="text-center text-[10px] text-[#6B6B6B]">Scan via OKX or Binance TRC20</p>
              </div>
            )}

            {/* Verification Form */}
            <form onSubmit={handleVerify} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#6B6B6B] mb-1">
                  {activeTab === "payoneer" ? "Payoneer Transaction ID / Ref Number:" : "TRC20 TxHash (Transaction ID):"}
                </label>
                <input
                  type="text"
                  required
                  placeholder={
                    activeTab === "payoneer"
                      ? "e.g. 09C648443DD44B91BE4267CF... or confirmation ref"
                      : "e.g. XKO5b41cb1fc2f7442889b3c972d63efcf4fecc92b2..."
                  }
                  value={transactionId}
                  onChange={e => setTransactionId(e.target.value)}
                  className="w-full input-clay px-3.5 py-2.5 text-xs text-[#1A1A1A]"
                />
              </div>

              {activeTab === "payoneer" && (
                <div>
                  <label className="block text-xs font-bold text-[#6B6B6B] mb-1">
                    Your Payoneer / Sender Email (Optional):
                  </label>
                  <input
                    type="email"
                    placeholder="e.g. your-email@example.com"
                    value={senderEmail}
                    onChange={e => setSenderEmail(e.target.value)}
                    className="w-full input-clay px-3.5 py-2.5 text-xs text-[#1A1A1A]"
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={isVerifying}
                className="w-full py-3 px-4 rounded-2xl btn-clay-dark text-xs font-bold flex items-center justify-center gap-2 text-white shadow-xs cursor-pointer"
              >
                {isVerifying ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Verifying on Blockchain / Gateway...</span>
                  </>
                ) : (
                  <>
                    <span>I Have Paid — Activate Unlimited ($2.67)</span>
                    <ArrowRight className="w-4 h-4 text-white" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
