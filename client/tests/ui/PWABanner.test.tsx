import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { PWAInstallBanner } from "../../src/ui/PWABanner";
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

describe("PWAInstallBanner", () => {
  beforeEach(() => vi.clearAllMocks());

  it("should render nothing when not installable", () => {
    setHook({ isInstallable: false });
    const { container } = render(<PWAInstallBanner />);
    expect(container.innerHTML).toBe("");
  });

  it("should dismiss the prompt from the close button", async () => {
    setHook();
    render(<PWAInstallBanner />);
    await userEvent.setup().click(screen.getByLabelText("Dismiss"));
    expect(baseReturn.dismissPrompt).toHaveBeenCalled();
  });

  it("should show the install button on chromium and trigger install", async () => {
    setHook({ platform: { isChromium: true } });
    render(<PWAInstallBanner />);
    await userEvent.setup().click(screen.getByText("Install Now"));
    expect(baseReturn.triggerChromiumInstall).toHaveBeenCalled();
    expect(screen.queryByText(/Add to Home Screen/)).toBeNull();
  });

  it("should show Add to Home Screen instructions on iOS Safari", () => {
    setHook({ platform: { isIOS: true, isIOSSafari: true } });
    render(<PWAInstallBanner />);
    expect(screen.getByText(/Add to Home Screen/)).toBeDefined();
    expect(screen.queryByText("Install Now")).toBeNull();
    expect(screen.queryByText(/requires Safari/)).toBeNull();
  });

  it("should tell iOS third-party browser users to open Safari", () => {
    setHook({ platform: { isIOS: true } });
    render(<PWAInstallBanner />);
    expect(screen.getByText(/requires Safari on iOS/)).toBeDefined();
  });
});
