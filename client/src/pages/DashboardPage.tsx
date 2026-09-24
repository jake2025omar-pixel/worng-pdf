import React, { useState, useEffect } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { UserSubscriptionStatus, CVGenerationResult } from "@/types/cv";
import {
  FileText,
  Clock,
  Download,
  Eye,
  Crown,
  CheckCircle2,
  Calendar,
  Lock,
  ArrowRight,
  Loader2,
  Fingerprint,
  Sparkles,
} from "lucide-react";
import { SubscriptionModal } from "@/components/SubscriptionModal";
import { getOrCreateFingerprint } from "@/lib/fingerprint";
import { toast } from "sonner";
import { FloatingShapes3D } from "@/components/FloatingShapes3D";

interface DashboardPageProps {
  status: UserSubscriptionStatus | null;
  onRefreshStatus?: () => void;
}

export function DashboardPage({ status, onRefreshStatus }: DashboardPageProps) {
  const [history, setHistory] = useState<CVGenerationResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const fingerprint = getOrCreateFingerprint();
      const res = await fetch(`/api/cv/history?fingerprint=${encodeURIComponent(fingerprint)}`, {
        headers: { "x-fingerprint": fingerprint },
      });
      const data = await res.json();
      if (data.ok && Array.isArray(data.history)) {
        setHistory(data.history);
      }
    } catch (err) {
      console.error("Failed to load CV history:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const isSubActive = status?.subscription_active;

  return (
    <div className="relative min-h-screen text-[#2A2125] py-12 px-4 sm:px-6 overflow-x-hidden">
      <FloatingShapes3D />

      <div className="max-w-6xl mx-auto space-y-8 relative z-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/60">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/60 border border-white/80 text-[#C78997] text-xs font-black mb-2 shadow-sm backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-[#C78997]" />
              <span>Anonymous Session Workspace</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-[#2A2125] tracking-tight">
              My Resumes & Pass Status
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/builder"
              className="button-glow px-5 py-2.5 rounded-2xl btn-sunset-rose text-xs font-black flex items-center gap-1.5 text-white shadow-sm"
            >
              <FileText className="w-3.5 h-3.5 text-white" />
              <span>Create New CV</span>
            </Link>
          </div>
        </div>

        {/* Subscription Status Card */}
        <div className="glass-card p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl glass-icon-circle bg-white/80 border border-white flex items-center justify-center text-[#C78997] shrink-0 shadow-sm">
                <Crown className="w-6 h-6 text-[#C78997]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-black text-[#2A2125]">Pass & Subscription Status</h2>
                  {isSubActive ? (
                    <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-[#C78997] text-white shadow-sm">
                      ACTIVE PRO
                    </span>
                  ) : status?.free_used ? (
                    <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                      FREE TIER CONSUMED
                    </span>
                  ) : (
                    <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-white/70 border border-white text-[#695B60]">
                      1 FREE PASS READY
                    </span>
                  )}
                </div>

                <p className="text-xs text-[#695B60] mt-1 flex items-center gap-1.5">
                  <Fingerprint className="w-3.5 h-3.5 text-[#C78997]" />
                  <span>Session: <strong className="text-[#2A2125] font-mono">{status?.fingerprint_id || "Anonymous Client"}</strong></span>
                </p>

                {isSubActive && status?.end_date && (
                  <p className="text-xs text-[#695B60] mt-0.5 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#C78997]" />
                    <span>Unlimited access valid until: <strong className="text-[#2A2125]">{new Date(status.end_date).toLocaleDateString()}</strong></span>
                  </p>
                )}
              </div>
            </div>

            {!isSubActive && (
              <button
                type="button"
                onClick={() => setIsSubModalOpen(true)}
                className="button-glow px-5 py-2.5 rounded-2xl btn-sunset-rose text-xs font-black whitespace-nowrap self-start sm:self-center text-white shadow-sm"
              >
                Upgrade to Unlimited ($2.67/mo)
              </button>
            )}
          </div>
        </div>

        {/* History Section */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-black text-[#2A2125] mb-4">Saved Documents in this Browser</h2>

          {isLoading ? (
            <div className="flex items-center justify-center p-12">
              <Loader2 className="w-6 h-6 animate-spin text-[#C78997]" />
            </div>
          ) : history.length === 0 ? (
            <div className="text-center p-8 bg-white/40 rounded-2xl border border-white/60">
              <p className="text-xs text-[#695B60]">No generated resumes found in this browser session.</p>
              <Link
                href="/builder"
                className="button-glow mt-3 inline-block px-4 py-2 rounded-xl btn-sunset-rose text-xs font-black text-white"
              >
                Generate First CV Free
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {history.map(item => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-white/50 border border-white/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl glass-icon-circle bg-white/80 flex items-center justify-center text-[#C78997] shadow-sm">
                      <FileText className="w-5 h-5 text-[#C78997]" />
                    </div>
                    <div>
                      <p className="text-xs font-black text-[#2A2125]">{item.targetJobTitle}</p>
                      <p className="text-[10px] text-[#695B60]">
                        {item.cvType.toUpperCase()} · Created {new Date(item.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <Link
                    href="/builder"
                    className="button-glow px-4 py-2 rounded-xl btn-sunset-glass text-xs font-bold text-[#2A2125] text-center"
                  >
                    Open in Builder
                  </Link>
                </div>
              ))}
            </div>
          )}
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
