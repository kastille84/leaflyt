import { act, render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { useCheckout } from "@stripe/react-stripe-js/checkout";

import PaymentForm from "../../../src/features/authentication/PaymentForm";

import * as GlobalContext from "../../../src/context/GlobalContext";
import useStripe from "../../../src/hooks/useStripe";

// fixtures
import { mockUseGlobalContextReturnObj } from "../../fixtures/context/globalContext";

// mocks
vi.mock("../../../src/context/GlobalContext");
vi.mock("../../../src/hooks/useStripe");
vi.mock("@stripe/react-stripe-js/checkout", () => ({
  useCheckout: vi.fn(),
  PaymentElement: () => <div data-testid="payment-element" />,
}));

const user = userEvent.setup();

describe("PaymentForm", () => {
  const setShowCancelSubscriptionModalMock = vi.fn();
  const setCancelSubscriptionModalTypeMock = vi.fn();
  const setCustomerIdMock = vi.fn();
  const confirmMock = vi.fn();
  const pickPlanInfo: any = { customerId: "cus_123" };

  function mockCheckoutSuccess() {
    vi.mocked(useCheckout).mockReturnValue({
      type: "success",
      checkout: {
        confirm: confirmMock,
        total: { total: { amount: "$10.00" } },
      },
    } as any);
  }

  beforeEach(() => {
    vi.mocked(GlobalContext.useGlobalContext).mockImplementation(() => ({
      ...mockUseGlobalContextReturnObj,
      setShowCancelSubscriptionModal: setShowCancelSubscriptionModalMock,
      setCancelSubscriptionModalType: setCancelSubscriptionModalTypeMock,
      setCustomerId: setCustomerIdMock,
    }));
    vi.mocked(useStripe).mockReturnValue({
      deleteCustomerAsync: vi.fn(),
    } as any);
    mockCheckoutSuccess();
  });
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should show the spinner while the checkout is loading", () => {
    vi.mocked(useCheckout).mockReturnValue({ type: "loading" } as any);
    render(<PaymentForm signedUpUser={null} pickPlanInfo={pickPlanInfo} />);
    expect(screen.getByText("Loading Payment Form")).toBeTruthy();
  });

  it("should show the error when the checkout fails", () => {
    vi.mocked(useCheckout).mockReturnValue({
      type: "error",
      error: { message: "Checkout failed" },
    } as any);
    render(<PaymentForm signedUpUser={null} pickPlanInfo={pickPlanInfo} />);
    expect(screen.getByText("Error: Checkout failed")).toBeTruthy();
  });

  it("should render the payment form with the total", () => {
    render(<PaymentForm signedUpUser={null} pickPlanInfo={pickPlanInfo} />);
    expect(screen.getByTestId("PaymentFormContainer")).toBeTruthy();
    expect(screen.getByTestId("payment-element")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Pay $10.00" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeTruthy();
  });

  it("should hide the cancel button when hideCancel is set", () => {
    render(
      <PaymentForm
        signedUpUser={null}
        pickPlanInfo={pickPlanInfo}
        hideCancel
      />
    );
    expect(screen.queryByRole("button", { name: "Cancel" })).toBeNull();
  });

  it("should open the cancel subscription modal on cancel", async () => {
    render(<PaymentForm signedUpUser={null} pickPlanInfo={pickPlanInfo} />);
    await act(async () => {
      await user.click(screen.getByRole("button", { name: "Cancel" }));
    });
    expect(setCustomerIdMock).toHaveBeenCalledWith("cus_123");
    expect(setCancelSubscriptionModalTypeMock).toHaveBeenCalledWith(
      "onPayment"
    );
    expect(setShowCancelSubscriptionModalMock).toHaveBeenCalledWith(true);
  });

  it("should confirm the payment and show the spinner", async () => {
    confirmMock.mockReturnValue(new Promise(() => {}));
    render(<PaymentForm signedUpUser={null} pickPlanInfo={pickPlanInfo} />);
    await act(async () => {
      await user.click(screen.getByRole("button", { name: "Pay $10.00" }));
    });
    expect(confirmMock).toHaveBeenCalled();
    expect(screen.getByText("Paying...")).toBeTruthy();
  });

  it("should show the error message when confirming the payment fails", async () => {
    confirmMock.mockResolvedValue({
      type: "error",
      error: { message: "Card declined" },
    });
    render(<PaymentForm signedUpUser={null} pickPlanInfo={pickPlanInfo} />);
    await act(async () => {
      await user.click(screen.getByRole("button", { name: "Pay $10.00" }));
    });
    await waitFor(() => {
      expect(screen.getByText("Error: Card declined")).toBeTruthy();
    });
    expect(screen.queryByText("Paying...")).toBeNull();
  });
});
