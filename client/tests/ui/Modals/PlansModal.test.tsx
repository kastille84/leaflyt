import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import PlansModal from "../../../src/ui/Modals/PlansModal";
import * as GlobalContext from "../../../src/context/GlobalContext";
import { mockUseGlobalContextReturnObj } from "../../fixtures/context/globalContext";
import { Plan } from "../../../src/interfaces/Plan";

vi.mock("../../../src/context/GlobalContext");

function makePlan(id: number, name: string): Plan {
  return {
    id,
    name,
    level: id,
    price: id * 5,
    lifespan: 2,
    subtitle: `${name} subtitle`,
    created_at: "",
    numOfMedia: 1,
    hasAnalytics: null,
    templateLimit: 1,
    hasBulkPosting: false,
    priceDescription: "desc",
    remotePostingLimit: 1,
    onLocationPostingLimit: 1,
    virtualPostingDistance: 1,
    maxAssets: 5,
    stripeProductId: null,
  };
}

describe("PlansModal", () => {
  const setShowPlansModal = vi.fn();
  const setValue = vi.fn();
  const clearErrors = vi.fn();
  const getValues = vi.fn();
  const plans = [makePlan(2, "Sprout"), makePlan(1, "Seed")];

  function renderModal(withPlans = true) {
    const queryClient = new QueryClient();
    if (withPlans) {
      queryClient.setQueryData(["getPlans"], { data: plans, error: null });
    }
    return render(
      <QueryClientProvider client={queryClient}>
        <PlansModal />
      </QueryClientProvider>,
    );
  }

  function mockContext(overrides: Record<string, unknown> = {}) {
    vi.mocked(GlobalContext.useGlobalContext).mockImplementation(() => ({
      ...mockUseGlobalContextReturnObj,
      showPlansModal: true,
      setShowPlansModal,
      currentFormOptions: { setValue, clearErrors, getValues },
      ...overrides,
    }));
  }

  beforeEach(() => {
    vi.clearAllMocks();
    getValues.mockReturnValue("2");
    mockContext();
  });

  it("should render plans sorted by level", () => {
    renderModal();
    const names = screen
      .getAllByText(/^(Seed|Sprout)$/)
      .map((n) => n.textContent);
    expect(names).toEqual(["Seed", "Sprout"]);
  });

  it("should render no plans when none are cached", () => {
    renderModal(false);
    expect(screen.queryByText("Seed")).not.toBeInTheDocument();
  });

  it("should mark the form's plan as selected", () => {
    renderModal();
    expect(screen.getAllByText("Selected")).toHaveLength(1);
  });

  it("should set the plan on the form and close when selected", async () => {
    renderModal();
    await userEvent.click(screen.getAllByRole("button", { name: "Select" })[0]);
    expect(setValue).toHaveBeenCalledWith("plan", "1");
    expect(clearErrors).toHaveBeenCalledWith("plan");
    expect(setShowPlansModal).toHaveBeenCalledWith(false);
  });

  it("should close on Close", async () => {
    renderModal();
    await userEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(setShowPlansModal).toHaveBeenCalledWith(false);
  });

  it("should disable current and lower plans on upgrade", () => {
    mockContext({ bottomSlideInType: "upgrade", user: { plan: { id: 1 } } });
    renderModal();
    const [seed, sprout] = screen.getAllByRole("button", { name: "Select" });
    expect(seed).toBeDisabled();
    expect(sprout).toBeEnabled();
  });

  it("should disable the current plan and Seed on changePlan", () => {
    mockContext({ bottomSlideInType: "changePlan", user: { plan: { id: 2 } } });
    renderModal();
    const [seed, sprout] = screen.getAllByRole("button", { name: "Select" });
    expect(seed).toBeDisabled();
    expect(sprout).toBeDisabled();
  });

  it("should enable all plans for other slide-in types", () => {
    mockContext({ bottomSlideInType: "signup" });
    renderModal();
    screen
      .getAllByRole("button", { name: "Select" })
      .forEach((btn) => expect(btn).toBeEnabled());
  });
});
