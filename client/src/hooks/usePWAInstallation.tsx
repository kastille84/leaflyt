import { useState, useEffect } from "react";

// Define types for our custom beforeinstallprompt event
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

// Declare the platform state interface
export interface PWAPlatform {
  isChromium: boolean;
  isIOS: boolean;
  isIOSSafari: boolean;
  isStandalone: boolean;
}

const STORAGE_KEY = "pwa_prompt_dismissed_until";
const DAYS_TO_HIDE = 14;

export function usePWAInstallation() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState<boolean>(false);
  const [isDismissed, setIsDismissed] = useState<boolean>(true);
  const [platform, setPlatform] = useState<PWAPlatform>({
    isChromium: false,
    isIOS: false,
    isIOSSafari: false,
    isStandalone: false,
  });

  useEffect(() => {
    // 1. Storage check
    const dismissedUntil = localStorage.getItem(STORAGE_KEY);
    if (dismissedUntil) {
      const now = new Date().getTime();
      if (now < parseInt(dismissedUntil, 10)) {
        setIsDismissed(true);
      } else {
        localStorage.removeItem(STORAGE_KEY);
        setIsDismissed(false);
      }
    } else {
      setIsDismissed(false);
    }

    // 2. Feature + UA detection (robust across iOS browsers)
    const ua = navigator.userAgent || navigator.vendor || "";
    const isIOS =
      /iPad|iPhone|iPod/.test(ua) ||
      (navigator.platform === "MacIntel" &&
        (navigator as any).maxTouchPoints > 1);
    const isIOSSafari =
      isIOS &&
      /Safari/.test(ua) &&
      !/CriOS|FxiOS|OPiOS|EdgiOS|Chrome|Chromium/.test(ua);
    const supportsBeforeInstallPrompt =
      typeof window !== "undefined" && "onbeforeinstallprompt" in window;
    const isChromium = !!supportsBeforeInstallPrompt;

    // Handle legacy standalone checks on iOS safely using type casting
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as Navigator & { standalone?: boolean }).standalone ===
        true;

    setPlatform({ isChromium, isIOS, isIOSSafari, isStandalone });

    // 3. Setup strongly typed event listeners
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      setIsInstallable(false);
      setPlatform((prev) => ({ ...prev, isStandalone: true }));
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  // ... rest of hook unchanged ...

  const showUI = isInstallable || (platform.isIOS && !platform.isStandalone);

  return {
    isInstallable: showUI && !isDismissed && !platform.isStandalone,
    platform,
    triggerChromiumInstall: async (): Promise<boolean> => {
      if (!deferredPrompt) return false;
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      setDeferredPrompt(null);
      setIsInstallable(false);
      return outcome === "accepted";
    },
    dismissPrompt: (): void => {
      const expireTime =
        new Date().getTime() + DAYS_TO_HIDE * 24 * 60 * 60 * 1000;
      localStorage.setItem(STORAGE_KEY, expireTime.toString());
      setIsDismissed(true);
    },
  };
}
