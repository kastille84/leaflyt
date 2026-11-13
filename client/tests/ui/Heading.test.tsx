import { render, screen } from "@testing-library/react";
import Heading from "../../src/ui/Heading";

describe("Heading", () => {
  it.each(["h1", "h2", "h3"] as const)("should render a %s element", (tag) => {
    render(<Heading as={tag}>Title</Heading>);
    expect(screen.getByRole("heading", { name: "Title" }).tagName).toBe(
      tag.toUpperCase()
    );
  });

  it("should size h1 larger than h2 and weight h3 lighter than h2", () => {
    render(
      <>
        <Heading as="h1">One</Heading>
        <Heading as="h2">Two</Heading>
        <Heading as="h3">Three</Heading>
      </>
    );
    const h1 = getComputedStyle(screen.getByRole("heading", { name: "One" }));
    const h2 = getComputedStyle(screen.getByRole("heading", { name: "Two" }));
    const h3 = getComputedStyle(screen.getByRole("heading", { name: "Three" }));
    expect(parseFloat(h1.fontSize)).toBeGreaterThan(parseFloat(h2.fontSize));
    expect(h3.fontSize).toBe(h2.fontSize);
    expect(Number(h3.fontWeight)).toBeLessThan(Number(h2.fontWeight));
  });

  it("should render h4 without a size rule", () => {
    render(<Heading as="h4">Small</Heading>);
    expect(screen.getByRole("heading", { level: 4 })).toBeInTheDocument();
  });
});
