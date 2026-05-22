import { render } from "@testing-library/react";
import WhyUpgrade from "../../../src/features/authentication/WhyUpgrade";

describe("WhyUpgrade", () => {
  it("renders without crashing", () => {
    const { container } = render(<WhyUpgrade />);
    expect(container).toBeInTheDocument();
  });
});
