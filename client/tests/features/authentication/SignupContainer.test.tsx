import { render, screen, act } from "@testing-library/react";
import SignupContainer from "../../../src/features/authentication/SignupContainer";

let capturedSetSignedUpUser: any;
let capturedSetPickPlanInfo: any;

vi.mock("../../../src/features/authentication/WhyRegister", () => ({
  default: () => <div data-testid="why-register" />,
}));
vi.mock("../../../src/features/authentication/SignupForm", () => ({
  default: ({ setSignedUpUser }: any) => {
    capturedSetSignedUpUser = setSignedUpUser;
    return <div data-testid="signup-form" />;
  },
}));
vi.mock("../../../src/features/authentication/PickPlanForm", () => ({
  default: ({ setPickPlanInfo }: any) => {
    capturedSetPickPlanInfo = setPickPlanInfo;
    return <div data-testid="pick-plan-form" />;
  },
}));
vi.mock("../../../src/features/authentication/PaymentFormContainer", () => ({
  default: () => <div data-testid="payment-form-container" />,
}));

describe("SignupContainer", () => {
  it("shows the signup form first", () => {
    render(<SignupContainer />);
    expect(screen.getByTestId("why-register")).toBeTruthy();
    expect(screen.getByTestId("signup-form")).toBeTruthy();
    expect(screen.queryByTestId("pick-plan-form")).toBeNull();
    expect(screen.queryByTestId("payment-form-container")).toBeNull();
  });

  it("shows the plan form after signing up", () => {
    render(<SignupContainer />);
    act(() => capturedSetSignedUpUser({ id: "u1" }));
    expect(screen.queryByTestId("signup-form")).toBeNull();
    expect(screen.getByTestId("pick-plan-form")).toBeTruthy();
  });

  it("shows the payment form after picking a plan", () => {
    render(<SignupContainer />);
    act(() => capturedSetSignedUpUser({ id: "u1" }));
    act(() => capturedSetPickPlanInfo({ plan: "2", customerId: "cus_1" }));
    expect(screen.queryByTestId("pick-plan-form")).toBeNull();
    expect(screen.getByTestId("payment-form-container")).toBeTruthy();
  });
});
