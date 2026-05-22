import { render } from "@testing-library/react";
import PaymentFormContainer from "../../../src/features/authentication/PaymentFormContainer";

describe("PaymentFormContainer", () => {
  it("renders without crashing", () => {
    const { container } = render(<PaymentFormContainer />);
    expect(container).toBeInTheDocument();
  });
});
