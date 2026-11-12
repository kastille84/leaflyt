import { render, screen } from "@testing-library/react";
import Footer from "../../src/ui/Footer";

describe("Footer", () => {
  it("should render the support email link", () => {
    render(<Footer />);
    const link = screen.getByRole("link", { name: "support@Leaflit.us" });
    expect(link.getAttribute("href")).toBe("mailto:support@Leaflit.us");
  });

  it("should render the copyright with the current year", () => {
    render(<Footer />);
    expect(
      screen.getByText(
        `Copyright © ${new Date().getFullYear()} Leaflit. All rights reserved.`,
      ),
    ).toBeDefined();
  });
});
