import { render, screen } from "@testing-library/react";

import PaymentFormContainer from "../../../src/features/authentication/PaymentFormContainer";
import { useStripeContext } from "../../../src/context/StripeContext";
import useStripe from "../../../src/hooks/useStripe";

vi.mock("../../../src/context/StripeContext");
vi.mock("../../../src/hooks/useStripe");
vi.mock("../../../src/features/authentication/PaymentForm", () => ({
  default: (props: any) => (
    <div data-testid="payment-form">
      {String(props.hideCancel)}-{String(props.updatePaymentInfo)}
    </div>
  ),
}));
vi.mock("@stripe/react-stripe-js/checkout", () => ({
  CheckoutProvider: ({ children, options }: any) => (
    <div data-testid="checkout-provider" data-secret={options.clientSecret}>
      {children}
    </div>
  ),
  useCheckout: vi.fn(),
  PaymentElement: () => <div />,
}));

describe("PaymentFormContainer", () => {
  const createCheckoutSessionFn = vi.fn();
  const pickPlanInfo: any = { plan: { id: 2 }, customerId: "cus_123" };
  const signedUpUser: any = { id: "u1" };

  beforeEach(() => {
    vi.mocked(useStripeContext).mockReturnValue({
      stripe: {},
      loading: false,
    } as any);
    vi.mocked(useStripe).mockReturnValue({ createCheckoutSessionFn } as any);
  });
  afterEach(() => {
    vi.clearAllMocks();
    createCheckoutSessionFn.mockReset();
  });

  it("requests a checkout session with the plan and customer id", () => {
    render(
      <PaymentFormContainer
        signedUpUser={signedUpUser}
        pickPlanInfo={pickPlanInfo}
      />,
    );
    expect(createCheckoutSessionFn).toHaveBeenCalledTimes(1);
    expect(createCheckoutSessionFn.mock.calls[0][0]).toEqual({
      plan: pickPlanInfo.plan,
      customerId: "cus_123",
    });
  });

  it("does not request a checkout session without a signed up user", () => {
    render(
      <PaymentFormContainer signedUpUser={null} pickPlanInfo={pickPlanInfo} />,
    );
    expect(createCheckoutSessionFn).not.toHaveBeenCalled();
  });

  it("shows the spinner until the client secret arrives", () => {
    render(
      <PaymentFormContainer
        signedUpUser={signedUpUser}
        pickPlanInfo={pickPlanInfo}
      />,
    );
    expect(screen.getByText("Loading Payment Form...")).toBeTruthy();
    expect(screen.queryByTestId("payment-form")).toBeNull();
  });

  it("shows the spinner while stripe is loading", () => {
    vi.mocked(useStripeContext).mockReturnValue({
      stripe: null,
      loading: true,
    } as any);
    createCheckoutSessionFn.mockImplementation((_data, { onSuccess }) =>
      onSuccess({ clientSecret: "secret_1" }),
    );
    render(
      <PaymentFormContainer
        signedUpUser={signedUpUser}
        pickPlanInfo={pickPlanInfo}
      />,
    );
    expect(screen.getByText("Loading Payment Form...")).toBeTruthy();
  });

  it("renders the payment form with the client secret and props", () => {
    createCheckoutSessionFn.mockImplementation((_data, { onSuccess }) =>
      onSuccess({ clientSecret: "secret_1" }),
    );
    render(
      <PaymentFormContainer
        signedUpUser={signedUpUser}
        pickPlanInfo={pickPlanInfo}
        hideCancel
        updatePaymentInfo
      />,
    );
    expect(screen.getByTestId("checkout-provider").dataset.secret).toBe(
      "secret_1",
    );
    expect(screen.getByTestId("payment-form").textContent).toBe("true-true");
  });

  it("keeps the spinner when creating the checkout session fails", () => {
    createCheckoutSessionFn.mockImplementation((_data, { onError }) =>
      onError(new Error("boom")),
    );
    render(
      <PaymentFormContainer
        signedUpUser={signedUpUser}
        pickPlanInfo={pickPlanInfo}
      />,
    );
    expect(screen.getByText("Loading Payment Form...")).toBeTruthy();
  });
});
