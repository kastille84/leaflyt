import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import Pricing from "../../src/pages/Pricing";
import useGetPlans from "../../src/hooks/useGetPlans";
import * as GlobalContext from "../../src/context/GlobalContext";
import { mockUseGlobalContextReturnObj } from "../fixtures/context/globalContext";

vi.mock("../../src/hooks/useGetPlans");
vi.mock("../../src/context/GlobalContext");
vi.mock("../../src/ui/OverlaySpinner", () => ({
  default: ({ message }: { message: string }) => (
    <div data-testid="mock-spinner">{message}</div>
  ),
}));
vi.mock("../../src/ui/Plan/PlanItem", () => ({
  default: ({ plan }: { plan: { name: string } }) => (
    <div data-testid="mock-plan-item">{plan.name}</div>
  ),
}));

function renderPricing(hook: Record<string, unknown>) {
  vi.mocked(useGetPlans).mockReturnValue(hook as any);
  return render(
    <MemoryRouter>
      <Pricing />
    </MemoryRouter>,
  );
}

describe("Pricing", () => {
  const setBottomSlideInType = vi.fn();
  const setIsOpenBottomSlideIn = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(GlobalContext.useGlobalContext).mockReturnValue({
      ...mockUseGlobalContextReturnObj,
      setBottomSlideInType,
      setIsOpenBottomSlideIn,
    });
  });

  it("shows the spinner while loading", () => {
    renderPricing({ isLoading: true, plans: undefined, error: null });
    expect(screen.getByTestId("mock-spinner").textContent).toBe(
      "Loading Plans...",
    );
    expect(screen.queryAllByTestId("mock-plan-item")).toHaveLength(0);
  });

  it("shows the error message", () => {
    renderPricing({
      isLoading: false,
      plans: undefined,
      error: new Error("boom"),
    });
    expect(screen.getByText("Error loading plans: boom")).toBeTruthy();
  });

  it("renders plans sorted by level", () => {
    renderPricing({
      isLoading: false,
      error: null,
      plans: {
        data: [
          { id: 2, name: "Sprout", level: 2 },
          { id: 1, name: "Seed", level: 1 },
        ],
      },
    });
    const items = screen.getAllByTestId("mock-plan-item");
    expect(items.map((i) => i.textContent)).toEqual(["Seed", "Sprout"]);
  });

  it("opens the signup slide-in from Get Started", async () => {
    const user = userEvent.setup();
    renderPricing({ isLoading: false, plans: undefined, error: null });
    await user.click(screen.getByText("Get Started"));
    expect(setBottomSlideInType).toHaveBeenCalledWith("signup");
    expect(setIsOpenBottomSlideIn).toHaveBeenCalledWith(true);
    expect(
      screen.getByRole("link", { name: "← Back to Home" }).getAttribute("href"),
    ).toBe("/");
  });
});
