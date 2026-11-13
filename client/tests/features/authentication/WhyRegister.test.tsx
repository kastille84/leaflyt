import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import WhyRegister from "../../../src/features/authentication/WhyRegister";

const user = userEvent.setup();

describe("WhyRegister", () => {
  it("renders closed by default", () => {
    const { container } = render(<WhyRegister />);
    expect(screen.getByText("Why Signup?")).toBeTruthy();
    expect(container.firstElementChild?.className).not.toContain("open");
  });

  it("toggles open and closed when the opener is clicked", async () => {
    const { container } = render(<WhyRegister />);
    await user.click(screen.getByText("Why Register"));
    expect(container.firstElementChild?.className).toContain("open");
    await user.click(screen.getByText("Why Register"));
    expect(container.firstElementChild?.className).not.toContain("open");
  });
});
