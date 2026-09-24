import React, { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { UserSubscriptionStatus } from "@/types/cv";
import {
  CheckCircle2,
  ShieldCheck,
  ExternalLink,
  Copy,
  Lock,
  ArrowRight,
  AlertTriangle,
  Sparkles,
  Crown,
} from "lucide-react";
import { SubscriptionModal } from "@/components/SubscriptionModal";
import { toast } from "sonner";
import { OKX_USDT_TRC20_ADDRESS, SUBSCRIPTION_MONTHLY_PRICE, openPayoneerCheckout } from "@/services/payment_service";
import { ClayBackground } from "@/components/ClayBackground";

interface PricingPageProps {
  status: UserSubscriptionStatus | null;
  onRefreshStatus?: () => void;
}

export function PricingPage({ status, onRefreshStatus }: PricingPageProps) {
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);
  const [copiedTrc20, setCopiedTrc20] = useState(false);

  const isFreeUsed = Boolean(status?.free_used);
  const isSubActive = Boolean(status?.subscription_active);
  const isSecondTimeBlocked = isFreeUsed && !isSubActive;

  const handleCopyTrc20 = () => {
    navigator.clipboard.writeText(OKX_USDT_TRC20_ADDRESS);
    setCopiedTrc20(true);
    toast.success("OKX TRC20 Address copied to clipboard!");
    setTimeout(() => setCopiedTrc20(false), 2000);
  };

  return (
    <div className="relative min-h-screen text-[#1A1A1A] py-12 px-4 sm:px-6 overflow-x-hidden bg-[#F9F5EF]">
      <ClayBackground />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Second-Time Block Notification Banner */}
        {isSecondTimeBlocked && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-5 rounded-3xl bg-[#FFFFFF] border border-[#E8C4C4] text-[#1A1A1A] shadow-[0_12px_30px_rgba(0,0,0,0.04)] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#E8C4C4]/50 border border-[#E8C4C4] flex items-center justify-center text-[#1A1A1A] font-black text-lg shrink-0">
                <AlertTriangle className="w-5 h-5 text-[#1A1A1A]" />
              </div>
              <div>
                <h2 className="text-base font-black text-[#1A1A1A]">
                  You've used your free CV & Resume
                </h2>
                <p className="text-xs text-[#6B6B6B] mt-0.5">
                  Unlock unlimited document generations, all 6 executive templates, and 10-year recruiter ATS matching for just $2.67/month.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsSubModalOpen(true)}
              className="px-5 py-2.5 rounded-2xl btn-clay-dark text-xs shrink-0 flex items-center gap-1.5 text-white font-bold cursor-pointer"
            >
              <span>Subscribe Now ($2.67)</span>
              <ArrowRight className="w-3.5 h-3.5 text-white" />
            </button>
          </motion.div>
        )}

        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EDE7DE] text-[#1A1A1A] text-xs font-bold mb-3 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#1A1A1A]" />
            <span>Transparent Pricing · No Login Required · Yemen Compatible</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-[#1A1A1A] tracking-tight">
            First Free, Then <span className="underline decoration-[#E8C4C4] decoration-wavy decoration-2">$2.67 / Month</span>
          </h1>
          <p className="text-sm text-[#6B6B6B] mt-2">
            Build your first complete dual resume for free. Continue generating unlimited CVs for less than a cup of coffee.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Free Tier */}
          <div className="clay-card p-8 flex flex-col justify-between h-full">
            <div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#EDE7DE] text-[#1A1A1A]">
                Welcome Pass
              </span>
              <h2 className="text-2xl font-black text-[#1A1A1A] mt-3">Free First Generation</h2>
              <p className="text-xs text-[#6B6B6B] mt-1">Full-featured test run with no account needed.</p>

              <div className="my-6">
                <span className="text-4xl font-black text-[#1A1A1A]">$0</span>
                <span className="text-xs text-[#6B6B6B] ml-2">/ one-time</span>
              </div>

              <ul className="space-y-3 text-xs text-[#6B6B6B]">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#1A1A1A]" />
                  <span>1 Dual Resume & CV (Arabic + English)</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#1A1A1A]" />
                  <span>Old CV Scanner (PDF or Photo OCR)</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#1A1A1A]" />
                  <span>Standard Vector PDF Export</span>
                </li>
                <li className="flex items-center gap-2.5 text-[#6B6B6B]/60">
                  <Lock className="w-4 h-4 text-[#6B6B6B]/60" />
                  <span>Subsequent generations require pass</span>
                </li>
              </ul>
            </div>

            <Link
              href="/builder"
              className="mt-8 w-full py-3.5 px-4 rounded-2xl btn-clay-white text-xs font-bold text-center block text-[#1A1A1A] cursor-pointer"
            >
              Launch Builder
            </Link>
          </div>

          {/* Pro Tier */}
          <div className="clay-card p-8 flex flex-col justify-between h-full relative border-2 border-[#1A1A1A]">
            <div className="absolute top-4 right-4">
              <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-[#1A1A1A] text-white shadow-xs">
                UNLIMITED
              </span>
            </div>

            <div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#E8C4C4] text-[#1A1A1A]">
                Pro Unlimited
              </span>
              <h2 className="text-2xl font-black text-[#1A1A1A] mt-3">Monthly Unlimited Pass</h2>
              <p className="text-xs text-[#6B6B6B] mt-1">Full power for job seekers, recruiters, and consultants.</p>

              <div className="my-6">
                <span className="text-4xl font-black text-[#1A1A1A]">${SUBSCRIPTION_MONTHLY_PRICE}</span>
                <span className="text-xs text-[#6B6B6B] ml-2 font-bold">/ 30 days</span>
              </div>

              <ul className="space-y-3 text-xs text-[#1A1A1A] font-semibold">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#1A1A1A]" />
                  <span>Unlimited AI CV & Resume Generations</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#1A1A1A]" />
                  <span>All 6 Gulf & Global Executive Templates</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#1A1A1A]" />
                  <span>10-Year Recruiter ATS Keyword Optimization</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#1A1A1A]" />
                  <span>Direct Payoneer & OKX TRC20 Verification</span>
                </li>
              </ul>
            </div>

            <button
              type="button"
              onClick={() => setIsSubModalOpen(true)}
              className="mt-8 w-full py-3.5 px-4 rounded-2xl btn-clay-dark text-xs font-bold text-white flex items-center justify-center gap-2 cursor-pointer"
            >
              <Crown className="w-4 h-4 text-white" />
              <span>Subscribe for $2.67</span>
            </button>
          </div>
        </div>

        {/* Payment Methods Section (Payoneer Direct + OKX TRC20) */}
        <div className="clay-card p-8 mb-12">
          <div className="flex items-center gap-2.5 mb-6">
            <div className="w-9 h-9 rounded-xl clay-icon-circle bg-[#EDE7DE] flex items-center justify-center text-[#1A1A1A]">
              <ShieldCheck className="w-5 h-5 text-[#1A1A1A]" />
            </div>
            <h2 className="text-xl font-black text-[#1A1A1A]">Payment Options Built For Yemen & Globally</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Payoneer Link */}
            <div className="p-6 rounded-[28px] bg-[#F9F5EF] border border-[#EDE7DE] flex flex-col justify-between shadow-xs">
              <div>
                <span className="text-xs font-bold text-[#6B6B6B] uppercase tracking-wider block mb-1">
                  Option 1: Payoneer Direct
                </span>
                <h3 className="text-base font-black text-[#1A1A1A]">Pay via Card or Bank Transfer</h3>
                <p className="text-xs text-[#6B6B6B] mt-2 leading-relaxed">
                  Account: <strong className="text-[#1A1A1A]">AHMED OMAR SAEED BARASHED</strong>
                  <br />
                  Email: <span className="font-mono text-[#1A1A1A]">hatkook5050@gmail.com</span>
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#EDE7DE] flex items-center justify-between">
                <span className="text-xs text-[#6B6B6B]">Official Checkout Link</span>
                <button
                  type="button"
                  onClick={() => openPayoneerCheckout()}
                  className="px-4 py-2 rounded-xl btn-clay-dark text-xs font-bold text-white flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Pay $2.67</span>
                  <ExternalLink className="w-3 h-3 text-white" />
                </button>
              </div>
            </div>

            {/* OKX USDT TRC20 */}
            <div className="p-6 rounded-[28px] bg-[#F9F5EF] border border-[#EDE7DE] flex flex-col justify-between shadow-xs">
              <div>
                <span className="text-xs font-bold text-[#6B6B6B] uppercase tracking-wider block mb-1">
                  Option 2: OKX USDT (TRC20)
                </span>
                <h3 className="text-base font-black text-[#1A1A1A]">Direct Crypto Transfer to OKX</h3>
                <p className="text-xs text-[#6B6B6B] mt-2 leading-relaxed">
                  Send <strong>$2.67 USDT</strong> via the <strong>TRC20 (Tron)</strong> network to this deposit address:
                </p>
                <div className="mt-2 p-2.5 bg-[#FFFFFF] rounded-xl border border-[#EDE7DE] font-mono text-[11px] text-[#1A1A1A] break-all flex items-center justify-between gap-2 shadow-inner">
                  <span>{OKX_USDT_TRC20_ADDRESS}</span>
                  <button
                    type="button"
                    onClick={handleCopyTrc20}
                    className="p-1.5 text-[#6B6B6B] hover:text-[#1A1A1A] shrink-0"
                    title="Copy Address"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[#EDE7DE] flex items-center justify-between">
                <span className="text-xs text-[#6B6B6B]">TronScan Auto Verification</span>
                <button
                  type="button"
                  onClick={() => setIsSubModalOpen(true)}
                  className="px-4 py-2 rounded-xl btn-clay-white text-xs font-bold text-[#1A1A1A] cursor-pointer"
                >
                  Verify TxHash
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Subscription Modal */}
      <SubscriptionModal
        isOpen={isSubModalOpen}
        onClose={() => setIsSubModalOpen(false)}
        onSuccess={() => {
          setIsSubModalOpen(false);
          onRefreshStatus?.();
        }}
      />
    </div>
  );
}
