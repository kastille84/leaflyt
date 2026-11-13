import { render, screen } from "@testing-library/react";
import TermsOfUse from "../../src/partials/TermsOfUse";

describe("TermsOfUse", () => {
  it("renders the document", () => {
    render(<TermsOfUse />);
    expect(screen.getByRole("main")).toBeTruthy();
    expect(screen.getByRole("heading", { level: 1 })).toBeTruthy();
    expect(screen.getAllByRole("heading", { level: 2 }).length).toBeGreaterThan(
      0,
    );
  });
});
