import { render, screen } from "@testing-library/react";
import StepSection from "../../src/ui/StepSection";

describe("StepSection", () => {
  it("should render the number and description", () => {
    render(<StepSection number="1" description="First step" />);
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("First step")).toBeInTheDocument();
  });

  it("should render children", () => {
    render(
      <StepSection number="2">
        <button>Do it</button>
      </StepSection>
    );
    expect(screen.getByRole("button", { name: "Do it" })).toBeInTheDocument();
  });

  it("should render only the number without a description or children", () => {
    const { container } = render(<StepSection number="3" />);
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(container.firstElementChild?.children).toHaveLength(1);
  });
});
