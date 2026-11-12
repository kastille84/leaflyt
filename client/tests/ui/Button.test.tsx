import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import Button from "../../src/ui/Button";

describe("Button", () => {
  it("should render children and handle clicks", async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Click me</Button>);
    await userEvent
      .setup()
      .click(screen.getByRole("button", { name: "Click me" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  const getFontSize = (el: HTMLElement) => parseFloat(getComputedStyle(el).fontSize);

  it("should default to the medium size and a pointer cursor", () => {
    render(
      <>
        <Button>Default</Button>
        <Button size="medium">Medium</Button>
      </>
    );
    const [defaultBtn, mediumBtn] = screen.getAllByRole("button");
    expect(getFontSize(defaultBtn)).toBe(getFontSize(mediumBtn));
    expect(getComputedStyle(defaultBtn).cursor).toBe("pointer");
  });

  it("should apply increasing font sizes for small, medium and large", () => {
    render(
      <>
        <Button size="small">S</Button>
        <Button size="medium">M</Button>
        <Button size="large">L</Button>
      </>
    );
    const [small, medium, large] = screen.getAllByRole("button");
    expect(getFontSize(small)).toBeLessThan(getFontSize(medium));
    expect(getFontSize(medium)).toBeLessThan(getFontSize(large));
  });

  it.each([
    "primary",
    "secondary",
    "secondary-outlined",
    "danger",
    "disabled",
  ] as const)("should render the %s variation", (variation) => {
    render(<Button variation={variation}>Btn</Button>);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("should show a not-allowed cursor for the disabled variation", () => {
    render(<Button variation="disabled">Btn</Button>);
    expect(getComputedStyle(screen.getByRole("button")).cursor).toBe(
      "not-allowed"
    );
  });
});
