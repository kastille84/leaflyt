import { render, screen } from "@testing-library/react";
import OverlaySpinner from "../../src/ui/OverlaySpinner";

describe("OverlaySpinner", () => {
  it("should render the overlay with the message", () => {
    render(<OverlaySpinner message="Loading flyers" />);
    const overlay = screen.getByTestId("overlay-spinner");
    expect(overlay).toBeInTheDocument();
    expect(screen.getByText("Loading flyers")).toBeInTheDocument();
    expect(getComputedStyle(overlay).position).toBe("absolute");
  });
});
