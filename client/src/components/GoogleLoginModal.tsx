import React, { useState } from "react";
import { X, User, Check, Mail } from "lucide-react";
import { toast } from "sonner";

interface GoogleLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser?: { id: string; email: string; name: string };
  onSuccess?: () => void;
}

export function GoogleLoginModal({ isOpen, onClose, currentUser, onSuccess }: GoogleLoginModalProps) {
  const [email, setEmail] = useState(currentUser?.email || "");
  const [name, setName] = useState(currentUser?.name || "");
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid Google email address.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/google-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          name: name.trim() || email.split("@")[0],
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "Failed to sign in");

      toast.success(`Signed in as ${data.user.email}`);
      onSuccess?.();
    } catch (err: any) {
      toast.error(err.message || "Failed to sign in with Google account.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#0D1117] border border-neutral-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b border-neutral-800 bg-neutral-900/50">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
              <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.04 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
            </svg>
            <h2 className="text-base font-bold text-white">Google Account Sign-In</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded text-neutral-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleLogin} className="p-6 space-y-4">
          <p className="text-xs text-neutral-400">
            Sign in with your Google email to sync your CV history, subscription benefits, and downloaded files.
          </p>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1">
              Google Email Address
            </label>
            <input
              type="email"
              required
              placeholder="e.g. jake2025omar@gmail.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1">
              Full Name (as appears in your CV)
            </label>
            <input
              type="text"
              placeholder="e.g. Omar Ahmed Saeed"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 px-4 rounded-lg bg-emerald-500 hover:bg-emerald-600 font-bold text-xs text-black transition-colors"
          >
            {isLoading ? "Signing in..." : "Continue with Google Account"}
          </button>
        </form>
      </div>
    </div>
  );
}
