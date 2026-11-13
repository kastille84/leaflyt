import { render } from "@testing-library/react";
import Checkbox from "../../src/ui/Checkbox";

describe("Checkbox", () => {
  it("should render its placeholder container", () => {
    const { container } = render(<Checkbox />);
    expect(container.querySelector("div")).toBeInTheDocument();
  });
});
