import { render, screen, act } from "@testing-library/react";
import UnpaidPlanContainer from "../../../src/features/authentication/UnpaidPlanContainer";
import * as GlobalContext from "../../../src/context/GlobalContext";
import { mockUseGlobalContextReturnObj } from "../../fixtures/context/globalContext";

let capturedSetPickPlanInfo: any;
let paymentContainerProps: any;

vi.mock("../../../src/context/GlobalContext");
vi.mock("../../../src/features/authentication/PaymentBillingInfoForm", () => ({
  default: (props: any) => {
    capturedSetPickPlanInfo = props.setPickPlanInfo;
    return <div data-testid="billing-info-form">{props.currentPlanId}</div>;
  },
}));
vi.mock("../../../src/features/authentication/PaymentFormContainer", () => ({
  default: (props: any) => {
    paymentContainerProps = props;
    return <div data-testid="payment-form-container" />;
  },
}));

describe("UnpaidPlanContainer", () => {
  function mockUser(user: any) {
    vi.mocked(GlobalContext.useGlobalContext).mockImplementation(() => ({
      ...mockUseGlobalContextReturnObj,
      user,
    }));
  }

  it("shows the payment failure warning and the billing form", () => {
    mockUser({ id: "u1", plan: { id: 2 } });
    render(<UnpaidPlanContainer />);
    expect(
      screen.getByText(/Your plan is on hold due to payment failure/),
    ).toBeTruthy();
    expect(screen.getByTestId("billing-info-form").textContent).toBe("2");
    expect(screen.queryByTestId("payment-form-container")).toBeNull();
  });

  it("shows the payment form after the billing info is submitted", () => {
    const user = { id: "u1", plan: { id: 2 } };
    mockUser(user);
    render(<UnpaidPlanContainer />);
    act(() => capturedSetPickPlanInfo({ customerId: "cus_1" }));
    expect(screen.queryByTestId("billing-info-form")).toBeNull();
    expect(screen.getByTestId("payment-form-container")).toBeTruthy();
    expect(paymentContainerProps.hideCancel).toBe(true);
    expect(paymentContainerProps.updatePaymentInfo).toBe(true);
    expect(paymentContainerProps.signedUpUser).toBe(user);
  });

  it("renders neither form without a user", () => {
    mockUser(null);
    render(<UnpaidPlanContainer />);
    expect(screen.queryByTestId("billing-info-form")).toBeNull();
    expect(screen.queryByTestId("payment-form-container")).toBeNull();
  });
});
