// Anonymous Browser Fingerprint Utility - 100% Login-Free, Yemen-Compatible

export function getOrCreateFingerprint(): string {
  try {
    const existing = localStorage.getItem("worngpdf_fingerprint");
    if (existing && existing.startsWith("fp_")) {
      return existing;
    }

    // Build hardware/browser signature
    const screenRes = `${window.screen.width}x${window.screen.height}x${window.screen.colorDepth}`;
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
    const language = navigator.language || "en";
    const userAgent = navigator.userAgent;
    const randomSalt = Math.random().toString(36).slice(2, 10);

    // Simple deterministic hash
    const raw = `${screenRes}|${timezone}|${language}|${userAgent}|${randomSalt}|${Date.now()}`;
    let hash = 0;
    for (let i = 0; i < raw.length; i++) {
      hash = (hash << 5) - hash + raw.charCodeAt(i);
      hash |= 0;
    }
    const hex = Math.abs(hash).toString(16) + Math.random().toString(36).slice(2, 8);
    const fingerprint = `fp_${hex}`;

    localStorage.setItem("worngpdf_fingerprint", fingerprint);
    return fingerprint;
  } catch {
    return "fp_anonymous_guest";
  }
}
