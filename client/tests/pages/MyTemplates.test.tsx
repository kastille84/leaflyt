import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import MyTemplates from "../../src/pages/MyTemplates";
import useGetUserLimits from "../../src/hooks/useGetUserLimits";
import * as GlobalContext from "../../src/context/GlobalContext";
import { mockUseGlobalContextReturnObj } from "../fixtures/context/globalContext";

vi.mock("../../src/hooks/useGetUserLimits");
vi.mock("../../src/context/GlobalContext");
vi.mock("../../src/features/template/myTemplates/TemplateList", () => ({
  default: () => <div data-testid="mock-template-list" />,
}));
vi.mock("../../src/ui/UpgradeText", () => ({
  default: ({ text }: { text: string }) => <span>{text}</span>,
}));
vi.mock("../../src/ui/LimitExceededWarning", () => ({
  default: ({ text }: { text: string }) => (
    <div data-testid="mock-limit-warning">{text}</div>
  ),
}));

describe("MyTemplates", () => {
  const setIsOpenFlyerDrawer = vi.fn();
  const setDrawerAction = vi.fn();

  function setup(limit: number, count: number, canUpgrade = false) {
    vi.mocked(useGetUserLimits).mockReturnValue({
      templates: { limit },
      canUpgrade,
    } as any);
    vi.mocked(GlobalContext.useGlobalContext).mockReturnValue({
      ...mockUseGlobalContextReturnObj,
      user: { templates: new Array(count).fill({}) },
      setIsOpenFlyerDrawer,
      setDrawerAction,
    } as any);
    return render(<MyTemplates />);
  }

  beforeEach(() => vi.clearAllMocks());

  it("opens the create-template drawer", async () => {
    const user = userEvent.setup();
    setup(3, 1, true);
    expect(screen.getByText(/1 of 3 templates/)).toBeTruthy();
    expect(screen.getByText("Need more templates?")).toBeTruthy();
    expect(screen.queryByTestId("mock-limit-warning")).toBeNull();
    await user.click(screen.getByTestId("create-template-button"));
    expect(setDrawerAction).toHaveBeenCalledWith("createTemplate");
    expect(setIsOpenFlyerDrawer).toHaveBeenCalledWith(true);
    expect(screen.getByTestId("mock-template-list")).toBeTruthy();
  });

  it("disables creation at the limit", () => {
    setup(2, 2);
    expect(
      (screen.getByTestId("create-template-button") as HTMLButtonElement)
        .disabled,
    ).toBe(true);
    expect(screen.queryByTestId("mock-limit-warning")).toBeNull();
  });

  it("warns when over the limit", () => {
    setup(1, 2);
    expect(screen.getByTestId("mock-limit-warning")).toBeTruthy();
  });

  it("handles a user without templates", () => {
    vi.mocked(useGetUserLimits).mockReturnValue({
      templates: { limit: 1 },
      canUpgrade: false,
    } as any);
    vi.mocked(GlobalContext.useGlobalContext).mockReturnValue({
      ...mockUseGlobalContextReturnObj,
      user: null,
    } as any);
    render(<MyTemplates />);
    expect(
      (screen.getByTestId("create-template-button") as HTMLButtonElement)
        .disabled,
    ).toBe(false);
  });
});
