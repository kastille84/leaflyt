import { render, screen } from "@testing-library/react";
import SavedFlyers from "../../src/pages/SavedFlyers";

vi.mock("../../src/features/saved_flyers/SavedFlyersList", () => ({
  default: () => <div data-testid="mock-saved-list" />,
}));

describe("SavedFlyers", () => {
  it("renders the heading and the list", () => {
    render(<SavedFlyers />);
    expect(screen.getByRole("heading", { name: "Saved Flyers" })).toBeTruthy();
    expect(
      screen.getByText("Redeem deals / view your saved flyers"),
    ).toBeTruthy();
    expect(screen.getByTestId("mock-saved-list")).toBeTruthy();
  });
});
