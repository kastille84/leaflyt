import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import WhyUpgrade from "../../../src/features/authentication/WhyUpgrade";

const user = userEvent.setup();

describe("WhyUpgrade", () => {
  it("renders closed by default", () => {
    const { container } = render(<WhyUpgrade />);
    expect(container.firstElementChild?.className).not.toContain("open");
  });

  it("toggles open and closed when the opener is clicked", async () => {
    const { container } = render(<WhyUpgrade />);
    await user.click(screen.getByText("Why Upgrade"));
    expect(container.firstElementChild?.className).toContain("open");
    await user.click(screen.getByText("Why Upgrade"));
    expect(container.firstElementChild?.className).not.toContain("open");
  });
});
