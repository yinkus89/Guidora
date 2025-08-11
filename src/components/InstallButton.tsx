// src/components/InstallButton.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

// Chromium's beforeinstallprompt event (minimal typing)
type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

// Allow caching the event globally (optional, handy for reuse/debug)
declare global {
  interface Window {
    deferredPrompt?: BeforeInstallPromptEvent | null;
  }
}

interface InstallButtonProps {
  className?: string;
}

export default function InstallButton({ className }: InstallButtonProps) {
  const [deferred, setDeferred] = React.useState<BeforeInstallPromptEvent | null>(
    typeof window !== "undefined" ? window.deferredPrompt ?? null : null
  );
  const [eligible, setEligible] = React.useState(false);
  const [installed, setInstalled] = React.useState(
    typeof window !== "undefined" &&
      (window.matchMedia?.("(display-mode: standalone)").matches ||
        // iOS Safari heuristic
        (window.navigator as any).standalone === true)
  );

  React.useEffect(() => {
    if (installed) return;

    const onBIP = (e: Event) => {
      e.preventDefault();
      const bip = e as BeforeInstallPromptEvent;
      window.deferredPrompt = bip;
      setDeferred(bip);
      setEligible(true);
    };

    const onInstalled = () => {
      setInstalled(true);
      setEligible(false);
      setDeferred(null);
      window.deferredPrompt = null;
    };

    window.addEventListener("beforeinstallprompt", onBIP);
    window.addEventListener("appinstalled", onInstalled);

    // If something already stashed it before mount, use it
    if (window.deferredPrompt) {
      setDeferred(window.deferredPrompt);
      setEligible(true);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", onBIP);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, [installed]);

  const handleInstall = async () => {
    const ev = deferred || window.deferredPrompt;
    if (!ev) return;
    try {
      await ev.prompt();
      // optional: const { outcome } = await ev.userChoice;
    } finally {
      // can be used only once
      window.deferredPrompt = null;
      setDeferred(null);
      setEligible(false);
    }
  };

  if (installed || !eligible) return null;

  return (
    <Button variant="outline" onClick={handleInstall} className={className}>
      <Download className="h-4 w-4 mr-1" />
      Install
    </Button>
  );
}
