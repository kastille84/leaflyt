import { act, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import {
  PWAInstallBanner,
  PWA_BANNER_DELAY_MS,
} from "../../src/ui/PWABanner";
import { usePWAInstallation } from "../../src/hooks/usePWAInstallation";

vi.mock("../../src/hooks/usePWAInstallation", () => ({
  usePWAInstallation: vi.fn(),
}));

const baseReturn = {
  isInstallable: true,
  platform: {
    isChromium: false,
    isIOS: false,
    isIOSSafari: false,
    isStandalone: false,
  },
  triggerChromiumInstall: vi.fn(),
  dismissPrompt: vi.fn(),
};

function setHook(overrides: any = {}) {
  (usePWAInstallation as any).mockReturnValue({
    ...baseReturn,
    ...overrides,
    platform: { ...baseReturn.platform, ...(overrides.platform ?? {}) },
  });
}

// Real timers with no delay, so user-event clicks work normally.
function renderShown() {
  return render(<PWAInstallBanner delayMs={0} />);
}

async function bannerShown() {
  return screen.findByRole("region", { name: "Install Leaflit" });
}

describe("PWAInstallBanner", () => {
  beforeEach(() => vi.clearAllMocks());

  it("should render nothing when not installable", async () => {
    setHook({ isInstallable: false });
    const { container } = renderShown();
    await new Promise((r) => setTimeout(r, 20));
    expect(container.innerHTML).toBe("");
  });

  it("should wait for the delay before showing", () => {
    vi.useFakeTimers();
    try {
      setHook();
      render(<PWAInstallBanner />);
      expect(screen.queryByLabelText("Dismiss")).toBeNull();
      act(() => {
        vi.advanceTimersByTime(PWA_BANNER_DELAY_MS);
      });
      expect(screen.getByLabelText("Dismiss")).toBeDefined();
    } finally {
      vi.useRealTimers();
    }
  });

  it("should dismiss the prompt from the close button", async () => {
    setHook();
    renderShown();
    await bannerShown();
    await userEvent.setup().click(screen.getByLabelText("Dismiss"));
    expect(baseReturn.dismissPrompt).toHaveBeenCalled();
  });

  it("should show the install button on chromium and trigger install", async () => {
    setHook({ platform: { isChromium: true } });
    renderShown();
    await bannerShown();
    await userEvent.setup().click(screen.getByText("Install Now"));
    expect(baseReturn.triggerChromiumInstall).toHaveBeenCalled();
    expect(screen.queryByText(/Add to Home Screen/)).toBeNull();
  });

  it("should reveal Add to Home Screen steps on iOS Safari", async () => {
    setHook({ platform: { isIOS: true, isIOSSafari: true } });
    renderShown();
    await bannerShown();
    expect(screen.queryByText(/Add to Home Screen/)).toBeNull();
    expect(screen.queryByText("Install Now")).toBeNull();

    const how = screen.getByRole("button", { name: "How" });
    await userEvent.setup().click(how);
    expect(screen.getByText(/Add to Home Screen/)).toBeDefined();
    expect(how.getAttribute("aria-expanded")).toBe("true");
    expect(screen.queryByText(/requires Safari/)).toBeNull();

    await userEvent.setup().click(how);
    expect(screen.queryByText(/Add to Home Screen/)).toBeNull();
  });

  it("should tell iOS third-party browser users to open Safari", async () => {
    setHook({ platform: { isIOS: true } });
    renderShown();
    await bannerShown();
    expect(screen.getByText(/requires Safari on iOS/)).toBeDefined();
  });
});
