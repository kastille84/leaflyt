import { render, screen } from "@testing-library/react";
import CommunityGuidelines from "../../src/partials/CommunityGuidelines";

describe("CommunityGuidelines", () => {
  it("renders the document", () => {
    render(<CommunityGuidelines />);
    expect(screen.getByRole("main")).toBeTruthy();
    expect(screen.getByRole("heading", { level: 1 })).toBeTruthy();
    expect(screen.getAllByRole("heading", { level: 2 }).length).toBeGreaterThan(
      0,
    );
  });
});
