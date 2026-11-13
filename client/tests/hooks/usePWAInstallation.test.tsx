import { renderHook, act, waitFor } from "@testing-library/react";
import { usePWAInstallation } from "../../src/hooks/usePWAInstallation";

const STORAGE_KEY = "pwa_prompt_dismissed_until";
const IOS_SAFARI_UA =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";
const IOS_CHROME_UA =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/120.0 Mobile/15E148 Safari/604.1";

const originalUA = navigator.userAgent;

function setUA(ua: string) {
  Object.defineProperty(navigator, "userAgent", {
    configurable: true,
    value: ua,
  });
}

function mockStandalone(matches: boolean) {
  vi.spyOn(window, "matchMedia").mockImplementation(
    (query: string) =>
      ({
        matches,
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }) as unknown as MediaQueryList,
  );
}

function makeInstallEvent(outcome: "accepted" | "dismissed" = "accepted") {
  const event: any = new Event("beforeinstallprompt", { cancelable: true });
  event.prompt = vi.fn().mockResolvedValue(undefined);
  event.userChoice = Promise.resolve({ outcome, platform: "web" });
  return event;
}

describe("usePWAInstallation", () => {
  beforeEach(() => {
    localStorage.clear();
    mockStandalone(false);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    setUA(originalUA);
  });

  it("is not installable before any install prompt on a non-iOS device", async () => {
    setUA("Mozilla/5.0 (Windows NT 10.0) Chrome/120.0 Safari/537.36");
    const { result } = renderHook(() => usePWAInstallation());
    await waitFor(() => expect(result.current.platform.isIOS).toBe(false));
    expect(result.current.isInstallable).toBe(false);
  });

  it("becomes installable on beforeinstallprompt and installs", async () => {
    const { result } = renderHook(() => usePWAInstallation());
    const event = makeInstallEvent("accepted");

    act(() => {
      window.dispatchEvent(event);
    });
    expect(event.defaultPrevented).toBe(true);
    await waitFor(() => expect(result.current.isInstallable).toBe(true));

    let accepted = false;
    await act(async () => {
      accepted = await result.current.triggerChromiumInstall();
    });
    expect(event.prompt).toHaveBeenCalled();
    expect(accepted).toBe(true);
    expect(result.current.isInstallable).toBe(false);
  });

  it("returns false when the install is dismissed by the user", async () => {
    const { result } = renderHook(() => usePWAInstallation());
    act(() => {
      window.dispatchEvent(makeInstallEvent("dismissed"));
    });
    await waitFor(() => expect(result.current.isInstallable).toBe(true));

    let accepted = true;
    await act(async () => {
      accepted = await result.current.triggerChromiumInstall();
    });
    expect(accepted).toBe(false);
  });

  it("triggerChromiumInstall returns false without a deferred prompt", async () => {
    const { result } = renderHook(() => usePWAInstallation());
    let accepted = true;
    await act(async () => {
      accepted = await result.current.triggerChromiumInstall();
    });
    expect(accepted).toBe(false);
  });

  it("clears installability after the appinstalled event", async () => {
    const { result } = renderHook(() => usePWAInstallation());
    act(() => {
      window.dispatchEvent(makeInstallEvent());
    });
    await waitFor(() => expect(result.current.isInstallable).toBe(true));

    act(() => {
      window.dispatchEvent(new Event("appinstalled"));
    });
    await waitFor(() => expect(result.current.platform.isStandalone).toBe(true));
    expect(result.current.isInstallable).toBe(false);
  });

  it("detects iOS Safari and shows the install UI", async () => {
    setUA(IOS_SAFARI_UA);
    const { result } = renderHook(() => usePWAInstallation());
    await waitFor(() => expect(result.current.platform.isIOS).toBe(true));
    expect(result.current.platform.isIOSSafari).toBe(true);
    expect(result.current.isInstallable).toBe(true);
  });

  it("detects iOS non-Safari browsers", async () => {
    setUA(IOS_CHROME_UA);
    const { result } = renderHook(() => usePWAInstallation());
    await waitFor(() => expect(result.current.platform.isIOS).toBe(true));
    expect(result.current.platform.isIOSSafari).toBe(false);
  });

  it("is not installable when already running standalone", async () => {
    setUA(IOS_SAFARI_UA);
    mockStandalone(true);
    const { result } = renderHook(() => usePWAInstallation());
    await waitFor(() => expect(result.current.platform.isStandalone).toBe(true));
    expect(result.current.isInstallable).toBe(false);
  });

  it("dismissPrompt stores an expiry and hides the prompt", async () => {
    setUA(IOS_SAFARI_UA);
    const { result } = renderHook(() => usePWAInstallation());
    await waitFor(() => expect(result.current.isInstallable).toBe(true));

    act(() => result.current.dismissPrompt());
    expect(result.current.isInstallable).toBe(false);
    const expiry = Number(localStorage.getItem(STORAGE_KEY));
    expect(expiry).toBeGreaterThan(Date.now() + 13 * 24 * 60 * 60 * 1000);
  });

  it("stays hidden while a dismissal has not expired", async () => {
    setUA(IOS_SAFARI_UA);
    localStorage.setItem(STORAGE_KEY, String(Date.now() + 100000));
    const { result } = renderHook(() => usePWAInstallation());
    await waitFor(() => expect(result.current.platform.isIOS).toBe(true));
    expect(result.current.isInstallable).toBe(false);
  });

  it("removes an expired dismissal and shows the prompt again", async () => {
    setUA(IOS_SAFARI_UA);
    localStorage.setItem(STORAGE_KEY, String(Date.now() - 1000));
    const { result } = renderHook(() => usePWAInstallation());
    await waitFor(() => expect(result.current.isInstallable).toBe(true));
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
  });
});
