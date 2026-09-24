import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  Coins,
  FileText,
  UserCheck,
  AlertCircle,
  RefreshCw,
  ExternalLink,
  Crown,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { FloatingShapes3D } from "@/components/FloatingShapes3D";

interface PaymentItem {
  id: string;
  fingerprint_id: string;
  amount: number;
  currency: string;
  provider: "payoneer" | "crypto_trc20";
  transactionId: string;
  status: "pending" | "approved" | "rejected";
  customerReference?: string;
  notes?: string;
  createdAt: string;
}

interface StatsData {
  totalGenerations: number;
  totalFreeUsers: number;
  totalSubscriptions: number;
  totalPayments: number;
  pendingPayments: number;
}

export default function Admin() {
  const [payments, setPayments] = useState<PaymentItem[]>([]);
  const [stats, setStats] = useState<StatsData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [approvingTxid, setApprovingTxid] = useState<string | null>(null);

  const fetchAdminData = async () => {
    setIsLoading(true);
    try {
      const [resPay, resStats] = await Promise.all([
        fetch("/api/admin/payments"),
        fetch("/api/admin/stats"),
      ]);

      if (resPay.ok) {
        const data = await resPay.json();
        setPayments(data.payments || []);
      }
      if (resStats.ok) {
        const data = await resStats.json();
        setStats(data.stats || null);
      }
    } catch {
      toast.error("Failed to load admin data.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleApprove = async (txid: string) => {
    setApprovingTxid(txid);
    try {
      const res = await fetch("/api/admin/approve-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ txid }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "Approval failed");

      toast.success(data.message || "Payment approved & subscription activated!");
      fetchAdminData();
    } catch (err: any) {
      toast.error(err.message || "Could not approve payment.");
    } finally {
      setApprovingTxid(null);
    }
  };

  const pendingPayments = payments.filter(p => p.status === "pending");
  const approvedPayments = payments.filter(p => p.status === "approved");

  return (
    <div className="relative min-h-screen text-[#2A2125] py-12 px-4 sm:px-6 overflow-x-hidden">
      <FloatingShapes3D />

      <div className="max-w-6xl mx-auto space-y-8 relative z-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/60 pb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/60 border border-white/80 text-[#C78997] text-xs font-black mb-2 shadow-sm backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-[#C78997]" />
              <span>WORNG PDF Admin Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#2A2125]">
              Payment & Subscription Management
            </h1>
            <p className="text-xs text-[#695B60] mt-1">
              Verify and approve Payoneer manual submissions and review OKX USDT TRC20 transactions.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchAdminData}
            disabled={isLoading}
            className="button-glow px-4 py-2 rounded-2xl btn-sunset-glass text-xs font-black flex items-center gap-2 self-start sm:self-auto shadow-sm text-[#2A2125]"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
            <span>Refresh Records</span>
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass-card p-5">
            <span className="text-[11px] font-black text-[#C78997] uppercase tracking-wider block">
              Pending Approvals
            </span>
            <p className="text-3xl font-black text-[#2A2125] mt-1">
              {stats?.pendingPayments ?? pendingPayments.length}
            </p>
            <span className="text-[10px] text-[#695B60] mt-1 block">Awaiting Payoneer check</span>
          </div>

          <div className="glass-card p-5">
            <span className="text-[11px] font-black text-[#C78997] uppercase tracking-wider block">
              Active Subscriptions
            </span>
            <p className="text-3xl font-black text-[#2A2125] mt-1">
              {stats?.totalSubscriptions ?? approvedPayments.length}
            </p>
            <span className="text-[10px] text-[#695B60] mt-1 block">$2.67 / mo active passes</span>
          </div>

          <div className="glass-card p-5">
            <span className="text-[11px] font-black text-[#C78997] uppercase tracking-wider block">
              Total CVs Generated
            </span>
            <p className="text-3xl font-black text-[#2A2125] mt-1">
              {stats?.totalGenerations ?? 0}
            </p>
            <span className="text-[10px] text-[#695B60] mt-1 block">Arabic & English dual files</span>
          </div>

          <div className="glass-card p-5">
            <span className="text-[11px] font-black text-[#C78997] uppercase tracking-wider block">
              Free Pass Users
            </span>
            <p className="text-3xl font-black text-[#2A2125] mt-1">
              {stats?.totalFreeUsers ?? 0}
            </p>
            <span className="text-[10px] text-[#695B60] mt-1 block">Unique fingerprint passes</span>
          </div>
        </div>

        {/* Section 1: Pending Payoneer Approvals */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#C78997]" />
              <h2 className="text-lg font-black text-[#2A2125]">Pending Payoneer Payments</h2>
            </div>
            <span className="text-xs font-bold text-amber-700 bg-amber-100 border border-amber-300 px-3 py-0.5 rounded-full">
              {pendingPayments.length} Action Needed
            </span>
          </div>

          {pendingPayments.length === 0 ? (
            <div className="p-8 text-center bg-white/40 rounded-2xl border border-white/60 text-xs text-[#695B60]">
              <CheckCircle2 className="w-8 h-8 text-[#C78997] mx-auto mb-2" />
              <span>All Payoneer payments are up to date. No pending approvals.</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-white/70 text-[#695B60] font-bold border-b border-white">
                  <tr>
                    <th className="p-3">Fingerprint</th>
                    <th className="p-3">Method</th>
                    <th className="p-3">TxID / Reference</th>
                    <th className="p-3">Sender Email</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3">Date</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/60">
                  {pendingPayments.map(p => (
                    <tr key={p.id} className="hover:bg-white/40">
                      <td className="p-3 font-mono text-[11px] text-[#695B60]">{p.fingerprint_id}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200 text-[10px] font-bold uppercase">
                          {p.provider}
                        </span>
                      </td>
                      <td className="p-3 font-mono text-[#2A2125] font-bold">{p.transactionId}</td>
                      <td className="p-3 text-[#695B60]">{p.customerReference || "—"}</td>
                      <td className="p-3 font-bold text-[#C78997]">${p.amount}</td>
                      <td className="p-3 text-[#695B60] text-[11px]">
                        {new Date(p.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-3 text-right">
                        <button
                          type="button"
                          disabled={approvingTxid === p.transactionId}
                          onClick={() => handleApprove(p.transactionId)}
                          className="button-glow px-3 py-1.5 rounded-xl btn-sunset-rose text-xs font-black inline-flex items-center gap-1 text-white shadow-sm"
                        >
                          {approvingTxid === p.transactionId ? (
                            <span>Approving...</span>
                          ) : (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                              <span>Approve (Activate 30D)</span>
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Section 2: All Verified Transactions */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-black text-[#2A2125] mb-4">All Payment History (Payoneer & OKX TRC20)</h2>

          {payments.length === 0 ? (
            <p className="text-xs text-[#695B60]">No payment records logged yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-white/70 text-[#695B60] font-bold border-b border-white">
                  <tr>
                    <th className="p-3">Fingerprint</th>
                    <th className="p-3">Provider</th>
                    <th className="p-3">Transaction ID</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Logged Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/60">
                  {payments.map(p => (
                    <tr key={p.id} className="hover:bg-white/40">
                      <td className="p-3 font-mono text-[11px] text-[#695B60]">{p.fingerprint_id}</td>
                      <td className="p-3 font-bold text-[#2A2125]">
                        {p.provider === "crypto_trc20" ? "OKX TRC20" : "Payoneer"}
                      </td>
                      <td className="p-3 font-mono text-[#695B60] break-all max-w-[200px]">
                        {p.transactionId}
                      </td>
                      <td className="p-3 font-bold text-[#C78997]">${p.amount}</td>
                      <td className="p-3">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                            p.status === "approved"
                              ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                              : "bg-amber-100 text-amber-800 border border-amber-200"
                          }`}
                        >
                          {p.status}
                        </span>
                      </td>
                      <td className="p-3 text-[#695B60] text-[11px]">
                        {new Date(p.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
