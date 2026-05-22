import { render } from "@testing-library/react";
import PickPlanForm from "../../../src/features/authentication/PickPlanForm";

describe("PickPlanForm", () => {
  it("renders without crashing", () => {
    const { container } = render(<PickPlanForm />);
    expect(container).toBeInTheDocument();
  });
});
