import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import PlanItem from "../../../src/ui/Plan/PlanItem";
import { Plan } from "../../../src/interfaces/Plan";

const plan: Plan = {
  id: 1,
  name: "Garden",
  level: 1,
  price: 0,
  lifespan: 2,
  subtitle: "Start small",
  created_at: "2025-01-01",
  numOfMedia: 3,
  hasAnalytics: null,
  templateLimit: 4,
  hasBulkPosting: false,
  priceDescription: "Free forever",
  remotePostingLimit: 2,
  onLocationPostingLimit: 8,
  virtualPostingDistance: 1,
  maxAssets: 12,
  stripeProductId: null,
};

describe("PlanItem", () => {
  it("should render the plan details", () => {
    render(<PlanItem plan={plan} selected={false} />);
    expect(screen.getByText("Garden")).toBeInTheDocument();
    expect(screen.getByText("Start small")).toBeInTheDocument();
    expect(screen.getByText("$0")).toBeInTheDocument();
    expect(screen.getByText("Free forever")).toBeInTheDocument();
    // max flyers = on-location + remote
    expect(screen.getByText("10")).toBeInTheDocument();
    expect(screen.getByText("62.14")).toBeInTheDocument();
    expect(screen.getByText("12")).toBeInTheDocument();
  });

  it("should show the Selected badge only when selected", () => {
    const { rerender } = render(<PlanItem plan={plan} selected={false} />);
    expect(screen.queryByText("Selected")).toBeNull();
    rerender(<PlanItem plan={plan} selected />);
    expect(screen.getByText("Selected")).toBeInTheDocument();
  });

  it("should recommend only level 3", () => {
    const { rerender } = render(<PlanItem plan={plan} selected={false} />);
    expect(screen.queryByText("Recommended")).toBeNull();
    rerender(<PlanItem plan={{ ...plan, level: 3 }} selected={false} />);
    expect(screen.getByText("Recommended")).toBeInTheDocument();
  });

  it.each([
    [1, "Images only", "20mb"],
    [2, "Images only", "50mb"],
    [3, "Images & Videos", "75mb"],
    [4, "Images & Videos", "100mb"],
  ])("should describe level %i media", (level, type, size) => {
    render(<PlanItem plan={{ ...plan, level }} selected={false} />);
    expect(screen.getByText(type)).toBeInTheDocument();
    expect(screen.getByText(size)).toBeInTheDocument();
  });

  it("should not render the Select button without an action", () => {
    render(<PlanItem plan={plan} selected={false} />);
    expect(screen.queryByRole("button", { name: "Select" })).toBeNull();
  });

  it("should call the action when Select is clicked", async () => {
    const action = vi.fn();
    render(<PlanItem plan={plan} selected={false} action={action} />);
    await userEvent.click(screen.getByRole("button", { name: "Select" }));
    expect(action).toHaveBeenCalledTimes(1);
  });

  it("should disable the Select button", async () => {
    const action = vi.fn();
    render(<PlanItem plan={plan} selected={false} action={action} disabled />);
    const button = screen.getByRole("button", { name: "Select" });
    expect(button).toBeDisabled();
    await userEvent.click(button);
    expect(action).not.toHaveBeenCalled();
  });
});
