import React from "react";
import { Button } from "@/components/ui/button";
import { X, Download } from "lucide-react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

export default function InstallNag() {
  const [deferred, setDeferred] = React.useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const onBIP = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
      setVisible(true);
    };
    window.addEventListener("beforeinstallprompt", onBIP);
    return () => window.removeEventListener("beforeinstallprompt", onBIP);
  }, []);

  const install = async () => {
    if (!deferred) return;
    await deferred.prompt();
    await deferred.userChoice; // we don’t need the value here
    setDeferred(null);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto max-w-5xl px-4">
        <div className="mt-3 rounded-xl border border-purple-300 bg-white shadow-lg p-3 flex items-center justify-between">
          <div className="text-sm">
            <span className="font-semibold text-purple-800">Install Guidora</span>{" "}
            <span className="text-gray-600">for faster access and offline use.</span>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={install} className="text-purple-700 border-purple-300 hover:bg-purple-50" variant="outline">
              <Download className="h-4 w-4 mr-1" /> Install
            </Button>
            <Button onClick={() => setVisible(false)} variant="ghost" aria-label="Dismiss">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
