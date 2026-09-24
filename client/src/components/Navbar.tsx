import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { UserSubscriptionStatus } from "@/types/cv";
import { Sparkles, Crown, ArrowRight, ShieldCheck, Check } from "lucide-react";
import { SubscriptionModal } from "./SubscriptionModal";

interface NavbarProps {
  status: UserSubscriptionStatus | null;
  onRefreshStatus?: () => void;
}

export function Navbar({ status, onRefreshStatus }: NavbarProps) {
  const [location] = useLocation();
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);

  const isSubActive = status?.subscription_active;
  const isFreeUsed = status?.free_used;

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-[#FFFFFF]/90 backdrop-blur-md border-b border-[#EDE7DE] shadow-[0_8px_30px_rgba(0,0,0,0.03)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
          {/* Logo with Soft Clay Squircle */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-2xl clay-icon-circle bg-[#FFFFFF] border border-[#EDE7DE] flex items-center justify-center text-[#1A1A1A] shadow-[0_4px_14px_rgba(0,0,0,0.04)] group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-[#1A1A1A]" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg text-[#1A1A1A] tracking-tight">
                  WORNG PDF
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E8C4C4] text-[#1A1A1A] shadow-sm">
                  AI
                </span>
              </div>
              <span className="text-[11px] text-[#6B6B6B] font-medium -mt-0.5">
                Arabic Resume & English CV
              </span>
            </div>
          </Link>

          {/* Navigation Links with Clean Typography */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-semibold text-[#6B6B6B]">
            <Link
              href="/"
              className={`hover:text-[#1A1A1A] transition-colors relative py-1 ${
                location === "/"
                  ? "text-[#1A1A1A] font-bold after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#1A1A1A] after:rounded-full"
                  : ""
              }`}
            >
              Home
            </Link>
            <Link
              href="/builder"
              className={`hover:text-[#1A1A1A] transition-colors relative py-1 ${
                location === "/builder"
                  ? "text-[#1A1A1A] font-bold after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#1A1A1A] after:rounded-full"
                  : ""
              }`}
            >
              AI Builder
            </Link>
            <Link
              href="/templates"
              className={`hover:text-[#1A1A1A] transition-colors relative py-1 ${
                location === "/templates"
                  ? "text-[#1A1A1A] font-bold after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#1A1A1A] after:rounded-full"
                  : ""
              }`}
            >
              Templates
            </Link>
            <Link
              href="/pricing"
              className={`hover:text-[#1A1A1A] transition-colors relative py-1 ${
                location === "/pricing"
                  ? "text-[#1A1A1A] font-bold after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#1A1A1A] after:rounded-full"
                  : ""
              }`}
            >
              Pricing ($2.67)
            </Link>
            <Link
              href="/admin"
              className={`hover:text-[#1A1A1A] text-[#6B6B6B] transition-colors ${
                location === "/admin" ? "text-[#1A1A1A] font-extrabold" : ""
              }`}
            >
              Admin
            </Link>
          </nav>

          {/* Status Indicator & Action Buttons */}
          <div className="flex items-center gap-3">
            {isSubActive ? (
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#E8C4C4]/40 border border-[#E8C4C4] text-[#1A1A1A] text-xs font-bold shadow-sm">
                <Crown className="w-3.5 h-3.5 text-[#1A1A1A]" />
                <span>UNLIMITED PASS ACTIVE</span>
              </div>
            ) : isFreeUsed ? (
              <button
                type="button"
                onClick={() => setIsSubModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl btn-clay-rose text-[#1A1A1A] text-xs font-bold cursor-pointer"
              >
                <span>Free Used · Unlock $2.67</span>
              </button>
            ) : (
              <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#EDE7DE]/60 border border-[#D6D2C8] text-[11px] font-semibold text-[#6B6B6B]">
                <span className="w-2 h-2 rounded-full bg-[#B8D4D0] animate-pulse" />
                <span>1 Free Generation Ready</span>
              </div>
            )}

            {!isSubActive && (
              <button
                type="button"
                onClick={() => setIsSubModalOpen(true)}
                className="px-4 py-2 rounded-2xl btn-clay-white text-xs flex items-center gap-1.5 text-[#1A1A1A] cursor-pointer"
              >
                <Crown className="w-3.5 h-3.5 text-[#1A1A1A]" />
                <span>Pass $2.67</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Subscription Modal (Payoneer + OKX TRC20) */}
      <SubscriptionModal
        isOpen={isSubModalOpen}
        onClose={() => setIsSubModalOpen(false)}
        onSuccess={() => {
          setIsSubModalOpen(false);
          onRefreshStatus?.();
        }}
      />
    </>
  );
}
