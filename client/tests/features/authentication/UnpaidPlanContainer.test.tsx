import { render } from "@testing-library/react";
import UnpaidPlanContainer from "../../../src/features/authentication/UnpaidPlanContainer";

describe("UnpaidPlanContainer", () => {
  it("renders without crashing", () => {
    const { container } = render(<UnpaidPlanContainer />);
    expect(container).toBeInTheDocument();
  });
});
