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

  describe("back button", () => {
    const deleteCustomerAsyncMock = vi.fn();
    const onBackMock = vi.fn();

    beforeEach(() => {
      vi.mocked(useStripe).mockReturnValue({
        deleteCustomerAsync: deleteCustomerAsyncMock,
      } as any);
    });
    afterEach(() => {
      deleteCustomerAsyncMock.mockReset();
    });

    it("should not show Back when onBack is not passed", () => {
      render(<PaymentForm signedUpUser={null} pickPlanInfo={pickPlanInfo} />);
      expect(screen.queryByRole("button", { name: "Back" })).toBeNull();
    });

    it("should delete the pending customer and then go back", async () => {
      deleteCustomerAsyncMock.mockResolvedValue({});
      render(
        <PaymentForm
          signedUpUser={null}
          pickPlanInfo={pickPlanInfo}
          onBack={onBackMock}
        />
      );
      await act(async () => {
        await user.click(screen.getByRole("button", { name: "Back" }));
      });
      expect(deleteCustomerAsyncMock).toHaveBeenCalledWith({
        customerId: "cus_123",
      });
      expect(onBackMock).toHaveBeenCalled();
    });

    it("should stay on the payment step and show the error when the delete fails", async () => {
      deleteCustomerAsyncMock.mockRejectedValue(new Error("Delete failed"));
      render(
        <PaymentForm
          signedUpUser={null}
          pickPlanInfo={pickPlanInfo}
          onBack={onBackMock}
        />
      );
      await act(async () => {
        await user.click(screen.getByRole("button", { name: "Back" }));
      });
      expect(await screen.findByText("Error: Delete failed")).toBeTruthy();
      expect(onBackMock).not.toHaveBeenCalled();
      expect(screen.queryByText("Going back...")).toBeNull();
    });

    it("should show the spinner and disable the buttons while going back", async () => {
      deleteCustomerAsyncMock.mockReturnValue(new Promise(() => {}));
      render(
        <PaymentForm
          signedUpUser={null}
          pickPlanInfo={pickPlanInfo}
          onBack={onBackMock}
        />
      );
      await act(async () => {
        await user.click(screen.getByRole("button", { name: "Back" }));
      });
      expect(screen.getByText("Going back...")).toBeTruthy();
      expect(
        (screen.getByRole("button", { name: "Cancel" }) as HTMLButtonElement)
          .disabled
      ).toBe(true);
    });
  });

  describe("promo code", () => {
    const applyPromotionCodeMock = vi.fn();
    const removePromotionCodeMock = vi.fn();

    beforeEach(() => {
      vi.mocked(useCheckout).mockReturnValue({
        type: "success",
        checkout: {
          confirm: confirmMock,
          total: { total: { amount: "$10.00" } },
          applyPromotionCode: applyPromotionCodeMock,
          removePromotionCode: removePromotionCodeMock,
        },
      } as any);
    });

    it("should disable Apply until a code is typed", () => {
      render(<PaymentForm signedUpUser={null} pickPlanInfo={pickPlanInfo} />);
      const applyBtn = screen.getByRole("button", {
        name: "Apply",
      }) as HTMLButtonElement;
      expect(applyBtn.disabled).toBe(true);
    });

    it("should apply a valid code and allow removing it", async () => {
      applyPromotionCodeMock.mockResolvedValue({ type: "success" });
      removePromotionCodeMock.mockResolvedValue({ type: "success" });
      render(<PaymentForm signedUpUser={null} pickPlanInfo={pickPlanInfo} />);
      await act(async () => {
        await user.type(screen.getByLabelText("Promo code"), " STOREFRONT ");
        await user.click(screen.getByRole("button", { name: "Apply" }));
      });
      expect(applyPromotionCodeMock).toHaveBeenCalledWith("STOREFRONT");
      expect(screen.getByTestId("promo-applied").textContent).toContain(
        "STOREFRONT"
      );

      await act(async () => {
        await user.click(screen.getByRole("button", { name: "Remove" }));
      });
      expect(removePromotionCodeMock).toHaveBeenCalled();
      expect(screen.queryByTestId("promo-applied")).toBeNull();
    });

    it("should apply the code when Enter is pressed", async () => {
      applyPromotionCodeMock.mockResolvedValue({ type: "success" });
      render(<PaymentForm signedUpUser={null} pickPlanInfo={pickPlanInfo} />);
      await act(async () => {
        await user.type(screen.getByLabelText("Promo code"), "ABC{Enter}");
      });
      expect(applyPromotionCodeMock).toHaveBeenCalledWith("ABC");
    });

    it("should show an error for an invalid code", async () => {
      applyPromotionCodeMock.mockResolvedValue({
        type: "error",
        error: { message: "Invalid promotion code" },
      });
      render(<PaymentForm signedUpUser={null} pickPlanInfo={pickPlanInfo} />);
      await act(async () => {
        await user.type(screen.getByLabelText("Promo code"), "NOPE");
        await user.click(screen.getByRole("button", { name: "Apply" }));
      });
      expect(screen.getByText("Invalid promotion code")).toBeTruthy();
      expect(screen.queryByTestId("promo-applied")).toBeNull();
    });

    it("should show an error when applying throws", async () => {
      applyPromotionCodeMock.mockRejectedValue(new Error("Network down"));
      render(<PaymentForm signedUpUser={null} pickPlanInfo={pickPlanInfo} />);
      await act(async () => {
        await user.type(screen.getByLabelText("Promo code"), "ABC");
        await user.click(screen.getByRole("button", { name: "Apply" }));
      });
      expect(screen.getByText("Network down")).toBeTruthy();
    });
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
