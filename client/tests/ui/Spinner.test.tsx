import { render } from "@testing-library/react";
import Spinner from "../../src/ui/Spinner";

describe("Spinner", () => {
  it("should render an animated element", () => {
    const { container } = render(<Spinner />);
    const spinner = container.firstElementChild as HTMLElement;
    expect(spinner).toBeInTheDocument();
    expect(getComputedStyle(spinner).animationName).not.toBe("none");
  });
});
