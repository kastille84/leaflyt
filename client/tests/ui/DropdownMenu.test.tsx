import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import DropdownMenu, {
  DropdownMenuDivider,
  DropdownMenuItem,
} from "../../src/ui/DropdownMenu";

function renderMenu(onItemClick = vi.fn()) {
  render(
    <div>
      <button>outside</button>
      <DropdownMenu>
        <DropdownMenuItem onClick={onItemClick}>First</DropdownMenuItem>
        <DropdownMenuDivider />
        <DropdownMenuItem $danger>Second</DropdownMenuItem>
        <DropdownMenuItem>Third</DropdownMenuItem>
      </DropdownMenu>
    </div>,
  );
  return {
    user: userEvent.setup(),
    trigger: screen.getByRole("button", { name: /flyer options/i }),
  };
}

describe("DropdownMenu", () => {
  it("should not show its children initially", () => {
    renderMenu();
    expect(screen.queryByText("First")).toBeNull();
  });

  it("should toggle the menu and aria-expanded when the trigger is clicked", async () => {
    const { user, trigger } = renderMenu();
    expect(trigger.getAttribute("aria-expanded")).toBe("false");

    await user.click(trigger);
    expect(screen.getByText("First")).toBeDefined();
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    expect(screen.getByRole("separator")).toBeDefined();

    await user.click(trigger);
    expect(screen.queryByText("First")).toBeNull();
  });

  it("should focus the first item when opened", async () => {
    const { user, trigger } = renderMenu();
    await user.click(trigger);
    expect(document.activeElement).toBe(screen.getByText("First"));
  });

  it("should close when clicking outside", async () => {
    const { user, trigger } = renderMenu();
    await user.click(trigger);
    await user.click(screen.getByText("outside"));
    expect(screen.queryByText("First")).toBeNull();
  });

  it("should close on Escape and return focus to the trigger", async () => {
    const { user, trigger } = renderMenu();
    await user.click(trigger);
    await user.keyboard("{Escape}");
    expect(screen.queryByText("First")).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });

  it("should run the item handler and close when an item is clicked", async () => {
    const onItemClick = vi.fn();
    const { user, trigger } = renderMenu(onItemClick);
    await user.click(trigger);
    await user.click(screen.getByText("First"));
    expect(onItemClick).toHaveBeenCalledTimes(1);
    expect(screen.queryByText("First")).toBeNull();
  });

  it("should navigate with arrow keys, Home and End", async () => {
    const { user, trigger } = renderMenu();
    await user.click(trigger);

    await user.keyboard("{ArrowDown}");
    expect(document.activeElement).toBe(screen.getByText("Second"));
    await user.keyboard("{End}");
    expect(document.activeElement).toBe(screen.getByText("Third"));
    await user.keyboard("{ArrowDown}");
    expect(document.activeElement).toBe(screen.getByText("First"));
    await user.keyboard("{ArrowUp}");
    expect(document.activeElement).toBe(screen.getByText("Third"));
    await user.keyboard("{Home}");
    expect(document.activeElement).toBe(screen.getByText("First"));
  });

  it("should activate the focused item with Enter and close", async () => {
    const onItemClick = vi.fn();
    const { user, trigger } = renderMenu(onItemClick);
    await user.click(trigger);
    await user.keyboard("{Enter}");
    expect(onItemClick).toHaveBeenCalledTimes(1);
    expect(screen.queryByText("First")).toBeNull();
  });

  it("should close on Tab", async () => {
    const { user, trigger } = renderMenu();
    await user.click(trigger);
    await user.keyboard("{Tab}");
    expect(screen.queryByText("First")).toBeNull();
  });
});
