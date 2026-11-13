import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Faq from "../../src/pages/Faq";

describe("Faq", () => {
  it("renders headings, back link, support email and FAQ items", () => {
    render(
      <MemoryRouter>
        <Faq />
      </MemoryRouter>,
    );
    expect(
      screen.getByRole("heading", { name: "Frequently Asked Questions" }),
    ).toBeTruthy();
    expect(
      screen.getByRole("link", { name: "← Back to Home" }).getAttribute("href"),
    ).toBe("/");
    expect(
      screen
        .getByRole("link", { name: "Support@Leaflit.us" })
        .getAttribute("href"),
    ).toBe("mailto:support@Leaflit.us");
    expect(screen.getByText("General Questions")).toBeTruthy();
    expect(screen.getByText("What is Leaflit?")).toBeTruthy();
    expect(screen.getByText("How do I get started with Leaflit?")).toBeTruthy();
  });
});
