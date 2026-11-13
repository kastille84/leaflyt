import { render, screen } from "@testing-library/react";
import LandingItem from "../../src/ui/LandingItem";

describe("LandingItem", () => {
  it("should render the title and description", () => {
    render(<LandingItem type="success" title="Easy" description="Post fast" />);
    expect(screen.getByRole("heading", { name: "Easy" })).toBeDefined();
    expect(screen.getByText("Post fast")).toBeDefined();
  });

  it("should render a different icon for each type", () => {
    const { container, rerender } = render(
      <LandingItem type="warning" title="t" description="d" />,
    );
    const warningHtml = container.querySelector("svg")!.innerHTML;

    rerender(<LandingItem type="success" title="t" description="d" />);
    expect(container.querySelector("svg")!.innerHTML).not.toBe(warningHtml);
  });
});
