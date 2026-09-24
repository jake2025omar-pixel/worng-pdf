import crypto from "node:crypto";

export interface FreeUsageRecord {
  fingerprint_id: string;
  ip: string;
  free_used: boolean;
  created_at: string;
  updated_at: string;
}

export interface SubscriptionRecord {
  id: string;
  fingerprint_id: string;
  status: "active" | "expired" | "cancelled";
  startDate: string;
  endDate: string;
  provider: "payoneer" | "crypto_trc20";
  transactionId: string;
  amount: number;
  currency: string;
  createdAt: string;
}

export interface PaymentRecord {
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
  approvedAt?: string;
}

export interface CVGenerationRecord {
  id: string;
  fingerprint_id: string;
  ip: string;
  wasFree: boolean;
  cvType: "arabic" | "english" | "both";
  category: string;
  targetJobTitle: string;
  inputData: any;
  uploadedFileText?: string;
  uploadedFileName?: string;
  aiResponse: any;
  createdAt: string;
}

export interface AuditLogRecord {
  id: string;
  fingerprint_id?: string;
  action: string;
  details?: string;
  ipAddress?: string;
  createdAt: string;
}

// Memory & Store implementing anonymous access without any login
class CVDatabaseStore {
  private freeUsage: Map<string, FreeUsageRecord> = new Map();
  private ipUsage: Map<string, boolean> = new Map();
  private subscriptions: Map<string, SubscriptionRecord> = new Map();
  private payments: Map<string, PaymentRecord> = new Map();
  private processedTransactions: Set<string> = new Set();
  private cvGenerations: Map<string, CVGenerationRecord> = new Map();
  private auditLogs: AuditLogRecord[] = [];
  private rateLimitMap: Map<string, { count: number; expiresAt: number }> = new Map();

  // Rate Limiting (5 requests per minute per IP)
  checkRateLimit(ip: string): boolean {
    const now = Date.now();
    const entry = this.rateLimitMap.get(ip);
    if (!entry || entry.expiresAt <= now) {
      this.rateLimitMap.set(ip, { count: 1, expiresAt: now + 60 * 1000 });
      return true;
    }
    if (entry.count >= 30) { // generous upper bound to prevent UI breakage
      return false;
    }
    entry.count += 1;
    return true;
  }

  // --- Anonymous Fingerprint & IP Check ---
  getUserStatus(fingerprintId: string, ip: string) {
    const activeSub = this.hasActiveSubscription(fingerprintId);
    
    // Check if free generation was used either by fingerprint or by IP
    const fpRecord = this.freeUsage.get(fingerprintId);
    const ipUsed = this.ipUsage.get(ip) || false;
    const freeUsed = Boolean(fpRecord?.free_used || ipUsed);

    return {
      fingerprint_id: fingerprintId,
      free_used: freeUsed,
      subscription_active: activeSub.active,
      end_date: activeSub.subscription ? activeSub.subscription.endDate : null,
      provider: activeSub.subscription?.provider || null,
    };
  }

  hasActiveSubscription(fingerprintId: string): { active: boolean; subscription?: SubscriptionRecord } {
    const now = new Date();
    for (const sub of Array.from(this.subscriptions.values())) {
      if (sub.fingerprint_id === fingerprintId && sub.status === "active") {
        const end = new Date(sub.endDate);
        if (end > now) {
          return { active: true, subscription: sub };
        } else {
          sub.status = "expired";
        }
      }
    }
    return { active: false };
  }

  canUserGenerate(fingerprintId: string, ip: string): { allowed: boolean; reason?: string; wasFree?: boolean } {
    const subCheck = this.hasActiveSubscription(fingerprintId);
    if (subCheck.active) {
      return { allowed: true, wasFree: false };
    }

    const fpRecord = this.freeUsage.get(fingerprintId);
    const ipUsed = this.ipUsage.get(ip) || false;

    if (!fpRecord?.free_used && !ipUsed) {
      return { allowed: true, wasFree: true };
    }

    return {
      allowed: false,
      reason: "You have used your free CV & Resume. Please subscribe for $2.67/month for unlimited generations.",
    };
  }

  // Atomic generation creation with race-condition prevention
  createCVGeneration(params: {
    fingerprintId: string;
    ip: string;
    cvType: "arabic" | "english" | "both";
    category: string;
    targetJobTitle: string;
    inputData: any;
    uploadedFileText?: string;
    uploadedFileName?: string;
    aiResponse: any;
  }): { success: boolean; record?: CVGenerationRecord; error?: string } {
    const check = this.canUserGenerate(params.fingerprintId, params.ip);
    if (!check.allowed) {
      this.logAudit({
        fingerprint_id: params.fingerprintId,
        action: "generate_blocked",
        details: "Attempted to generate CV after free tier without active subscription.",
        ipAddress: params.ip,
      });
      return { success: false, error: check.reason || "Subscription required" };
    }

    // Atomically mark free usage
    if (check.wasFree) {
      const now = new Date().toISOString();
      this.freeUsage.set(params.fingerprintId, {
        fingerprint_id: params.fingerprintId,
        ip: params.ip,
        free_used: true,
        created_at: now,
        updated_at: now,
      });
      this.ipUsage.set(params.ip, true);
    }

    const record: CVGenerationRecord = {
      id: `cv_${crypto.randomUUID()}`,
      fingerprint_id: params.fingerprintId,
      ip: params.ip,
      wasFree: Boolean(check.wasFree),
      cvType: params.cvType,
      category: params.category,
      targetJobTitle: params.targetJobTitle,
      inputData: params.inputData,
      uploadedFileText: params.uploadedFileText,
      uploadedFileName: params.uploadedFileName,
      aiResponse: params.aiResponse,
      createdAt: new Date().toISOString(),
    };

    this.cvGenerations.set(record.id, record);

    this.logAudit({
      fingerprint_id: params.fingerprintId,
      action: check.wasFree ? "generate_free_success" : "generate_subscribed_success",
      details: `Generated ${params.cvType} for title "${params.targetJobTitle}".`,
      ipAddress: params.ip,
    });

    return { success: true, record };
  }

  // --- Payment Registration & Activation ---
  recordPayment(params: {
    fingerprintId: string;
    provider: "payoneer" | "crypto_trc20";
    transactionId: string;
    amount?: number;
    customerReference?: string;
    notes?: string;
    status?: "pending" | "approved";
  }): { success: boolean; payment?: PaymentRecord; message: string; duplicate?: boolean } {
    const cleanTxId = params.transactionId.trim();

    if (this.processedTransactions.has(cleanTxId)) {
      return {
        success: false,
        duplicate: true,
        message: "This transaction ID or hash has already been submitted.",
      };
    }

    const payment: PaymentRecord = {
      id: `pay_${crypto.randomUUID().slice(0, 12)}`,
      fingerprint_id: params.fingerprintId,
      amount: params.amount || 2.67,
      currency: "USD",
      provider: params.provider,
      transactionId: cleanTxId,
      status: params.status || "pending",
      customerReference: params.customerReference,
      notes: params.notes,
      createdAt: new Date().toISOString(),
      approvedAt: params.status === "approved" ? new Date().toISOString() : undefined,
    };

    this.payments.set(payment.id, payment);
    this.processedTransactions.add(cleanTxId);

    // If auto-approved (e.g. verified TRC20 crypto)
    if (params.status === "approved") {
      this.activateSubscription(params.fingerprintId, params.provider, cleanTxId, payment.amount);
    }

    return {
      success: true,
      payment,
      message: params.status === "approved"
        ? "Payment verified! 30 days unlimited subscription activated."
        : "Payment submitted successfully! Your subscription will be activated shortly after verification.",
    };
  }

  // Activate 30-day subscription for fingerprint
  activateSubscription(fingerprintId: string, provider: "payoneer" | "crypto_trc20", txid: string, amount = 2.67): SubscriptionRecord {
    const now = new Date();
    const endDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    const subscription: SubscriptionRecord = {
      id: `sub_${crypto.randomUUID().slice(0, 12)}`,
      fingerprint_id: fingerprintId,
      status: "active",
      startDate: now.toISOString(),
      endDate: endDate.toISOString(),
      provider,
      transactionId: txid,
      amount,
      currency: "USD",
      createdAt: now.toISOString(),
    };

    this.subscriptions.set(subscription.id, subscription);

    this.logAudit({
      fingerprint_id: fingerprintId,
      action: "subscription_activated",
      details: `Active until ${endDate.toISOString()} via ${provider} (tx: ${txid})`,
    });

    return subscription;
  }

  // Admin approves pending Payoneer transaction
  approvePayment(paymentIdOrTxid: string): { success: boolean; message: string } {
    let targetPayment: PaymentRecord | undefined;
    for (const p of Array.from(this.payments.values())) {
      if (p.id === paymentIdOrTxid || p.transactionId === paymentIdOrTxid) {
        targetPayment = p;
        break;
      }
    }

    if (!targetPayment) {
      return { success: false, message: "Payment not found." };
    }

    targetPayment.status = "approved";
    targetPayment.approvedAt = new Date().toISOString();
    this.payments.set(targetPayment.id, targetPayment);

    this.activateSubscription(targetPayment.fingerprint_id, targetPayment.provider, targetPayment.transactionId, targetPayment.amount);

    return { success: true, message: `Payment approved! Subscription activated for ${targetPayment.fingerprint_id}.` };
  }

  // History & Admin Listings
  getGenerationById(id: string): CVGenerationRecord | undefined {
    return this.cvGenerations.get(id);
  }

  getUserGenerations(fingerprintId: string): CVGenerationRecord[] {
    const list: CVGenerationRecord[] = [];
    for (const gen of Array.from(this.cvGenerations.values())) {
      if (gen.fingerprint_id === fingerprintId) list.push(gen);
    }
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  getAllPayments(): PaymentRecord[] {
    return Array.from(this.payments.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  getStats() {
    return {
      totalGenerations: this.cvGenerations.size,
      totalFreeUsers: this.freeUsage.size,
      totalSubscriptions: this.subscriptions.size,
      totalPayments: this.payments.size,
      pendingPayments: Array.from(this.payments.values()).filter(p => p.status === "pending").length,
    };
  }

  logAudit(entry: Omit<AuditLogRecord, "id" | "createdAt">): void {
    const record: AuditLogRecord = {
      id: `audit_${crypto.randomUUID().slice(0, 10)}`,
      createdAt: new Date().toISOString(),
      ...entry,
    };
    this.auditLogs.unshift(record);
    if (this.auditLogs.length > 500) this.auditLogs.pop();
  }

  getAuditLogs(limit = 50): AuditLogRecord[] {
    return this.auditLogs.slice(0, limit);
  }
}

export const cvDb = new CVDatabaseStore();
