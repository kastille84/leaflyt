import { render } from "@testing-library/react";
import WhyRegister from "../../../src/features/authentication/WhyRegister";

describe("WhyRegister", () => {
  it("renders without crashing", () => {
    const { container } = render(<WhyRegister />);
    expect(container).toBeInTheDocument();
  });
});
