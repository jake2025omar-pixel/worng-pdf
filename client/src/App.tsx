import React, { useState, useEffect, useCallback } from "react";
import { Route, Switch } from "wouter";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import ErrorBoundary from "./components/ErrorBoundary";
import { Navbar } from "./components/Navbar";
import { LandingPage } from "./pages/LandingPage";
import { BuilderPage } from "./pages/BuilderPage";
import { TemplatesPage } from "./pages/TemplatesPage";
import { PricingPage } from "./pages/PricingPage";
import { DashboardPage } from "./pages/DashboardPage";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import { UserSubscriptionStatus } from "./types/cv";
import { getOrCreateFingerprint } from "./lib/fingerprint";
import { ClayBackground } from "./components/ClayBackground";

export default function App() {
  const [status, setStatus] = useState<UserSubscriptionStatus | null>(null);

  const fetchStatus = useCallback(async () => {
    try {
      const fingerprint = getOrCreateFingerprint();
      const res = await fetch(`/api/user/status?fingerprint=${encodeURIComponent(fingerprint)}`, {
        headers: {
          "x-fingerprint": fingerprint,
        },
      });
      const data = await res.json();
      if (data.ok) {
        setStatus({
          fingerprint_id: data.fingerprint_id,
          free_used: data.free_used,
          subscription_active: data.subscription_active,
          end_date: data.end_date,
          provider: data.provider,
        });
      }
    } catch (err) {
      console.error("[WORNG PDF] Failed to fetch user status:", err);
    }
  }, []);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  return (
    <ErrorBoundary>
      <TooltipProvider>
        <div className="min-h-screen text-[#1A1A1A] bg-[#F9F5EF] flex flex-col font-sans selection:bg-[#E8C4C4]/50 selection:text-[#1A1A1A] relative">
          <ClayBackground />
          <Navbar status={status} onRefreshStatus={fetchStatus} />

          <main className="flex-1 relative z-10">
            <Switch>
              <Route path="/">
                <LandingPage status={status} onRefreshStatus={fetchStatus} />
              </Route>
              <Route path="/builder">
                <BuilderPage status={status} onRefreshStatus={fetchStatus} />
              </Route>
              <Route path="/templates">
                <TemplatesPage />
              </Route>
              <Route path="/pricing">
                <PricingPage status={status} onRefreshStatus={fetchStatus} />
              </Route>
              <Route path="/dashboard">
                <DashboardPage status={status} onRefreshStatus={fetchStatus} />
              </Route>
              <Route path="/admin">
                <Admin />
              </Route>
              <Route component={NotFound} />
            </Switch>
          </main>

          <Toaster position="bottom-right" richColors />
        </div>
      </TooltipProvider>
    </ErrorBoundary>
  );
}
