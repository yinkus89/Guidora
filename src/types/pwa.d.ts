// Make this file a module so global augmentation works
export {};

declare global {
  interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
  }

  interface Window {
    deferredPrompt?: BeforeInstallPromptEvent | null;
  }
}
