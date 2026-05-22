import { render } from "@testing-library/react";
import ResetPassword from "../../../src/features/authentication/ResetPassword";

describe("ResetPassword", () => {
  it("renders without crashing", () => {
    const { container } = render(<ResetPassword />);
    expect(container).toBeInTheDocument();
  });
});
