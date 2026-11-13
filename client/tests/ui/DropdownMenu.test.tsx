import { render, screen, fireEvent } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import DropdownMenu from "../../src/ui/DropdownMenu";

describe("DropdownMenu", () => {
  it("should not show its children initially", () => {
    render(
      <DropdownMenu>
        <li>Item</li>
      </DropdownMenu>,
    );
    expect(screen.queryByText("Item")).toBeNull();
  });

  it("should toggle the children when the icon is clicked", async () => {
    const { container } = render(
      <DropdownMenu>
        <li>Item</li>
      </DropdownMenu>,
    );
    const user = userEvent.setup();
    const icon = container.querySelector("svg")!;

    await user.click(icon);
    expect(screen.getByText("Item")).toBeDefined();

    await user.click(icon);
    expect(screen.queryByText("Item")).toBeNull();
  });

  it("should close when the mouse leaves the menu", async () => {
    const { container } = render(
      <DropdownMenu>
        <li>Item</li>
      </DropdownMenu>,
    );
    await userEvent.setup().click(container.querySelector("svg")!);
    fireEvent.mouseLeave(screen.getByRole("list").parentElement!);
    expect(screen.queryByText("Item")).toBeNull();
  });
});
