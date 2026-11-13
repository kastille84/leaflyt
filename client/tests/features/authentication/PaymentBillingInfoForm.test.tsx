import { useEffect } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { expect, vi } from "vitest";
import toast from "react-hot-toast";
// components
import PaymentBillingInfoForm from "../../../src/features/authentication/PaymentBillingInfoForm";
// context
// hooks
import { useGlobalContext } from "../../../src/context/GlobalContext";
import useStripe from "../../../src/hooks/useStripe";
import useSignup from "../../../src/features/authentication/useSignup";
// services
// fixtures
// userEvent

// mocks
vi.mock("../../../src/context/GlobalContext", () => ({
  useGlobalContext: vi.fn(),
}));
vi.mock("../../../src/hooks/useStripe");
vi.mock("../../../src/features/authentication/useSignup");
vi.mock("react-hot-toast");
// the real input needs Google Places; fill the value it would save on selection
vi.mock("../../../src/ui/Form/AddressInput", () => ({
  default: ({ setValue }: { setValue: (name: string, value: any) => void }) => {
    useEffect(() => {
      setValue("addressObjToSave", {
        adr_address:
          '<span class="street-address">754 Broadway</span>, <span class="locality">Newburgh</span>, <span class="region">NY</span> <span class="postal-code">12550</span>, <span class="country-name">USA</span>',
      });
    }, [setValue]);
    return <div data-testid="address-input" />;
  },
}));

describe("PaymentBillingInfoForm", () => {
  const createCustomerFnMock = vi.fn();
  const deleteCustomerFnMock = vi.fn();
  const updateUserProfilePlanMock = vi.fn();
  const setPickPlanInfoMock = vi.fn();

  const paymentCompProps: any = {
    signedUpUser: {
      id: "123",
      email: "example@example.com",
      customers: [
        {
          customerId: "stripeCustomerId",
        },
      ],
      plan: { name: "Seed" },
    },
    setPickPlanInfo: setPickPlanInfoMock,
    currentPlanId: 1,
    updatedPaymentInfo: false,
  };

  beforeEach(() => {
    vi.mocked(useGlobalContext as any).mockReturnValue({
      setBottomSlideInType: vi.fn(),
      setIsOpenBottomSlideIn: vi.fn(),
      setUser: vi.fn(),
    });
    vi.mocked(useStripe as any).mockReturnValue({
      createCustomerFn: createCustomerFnMock,
      deleteCustomerAsync: deleteCustomerFnMock,
    });
    updateUserProfilePlanMock.mockResolvedValue({ user: { id: "123" } });
    vi.mocked(useSignup as any).mockReturnValue({
      updateUserProfilePlanAsyncFn: updateUserProfilePlanMock,
    });
  });
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should render the component", () => {
    render(<PaymentBillingInfoForm {...paymentCompProps} />);
    expect(
      screen.getByRole("heading", { name: /Billing Information/i }),
    ).toBeInTheDocument();
  });
  it('should switch to Free plan when "Switch to Free Plan" button is clicked', async () => {
    updateUserProfilePlanMock.mockResolvedValueOnce({
      user: {
        id: "123",
        email: "example@example.com",
      },
    });
    render(<PaymentBillingInfoForm {...paymentCompProps} />);
    const switchToFreePlanButton = screen.getByRole("button", {
      name: /Switch to Free Plan/i,
    });
    await userEvent.click(switchToFreePlanButton);
    await waitFor(() => {
      expect(deleteCustomerFnMock).toHaveBeenCalled();
    });
    await waitFor(() => {
      expect(updateUserProfilePlanMock).toHaveBeenCalledWith({
        userId: "123",
        plan: 1,
      });
    });
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith("Switched to free plan");
    });
  });
  it("should handle errors when switching to Free plan", async () => {
    deleteCustomerFnMock.mockRejectedValueOnce(new Error("Stripe error"));
    render(<PaymentBillingInfoForm {...paymentCompProps} />);
    const switchToFreePlanButton = screen.getByRole("button", {
      name: /Switch to Free Plan/i,
    });
    await userEvent.click(switchToFreePlanButton);
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "Failed to switch to free. Please try again.",
      );
    });
  });
  describe("submit the form", () => {
    async function fillAndSubmit() {
      render(
        <PaymentBillingInfoForm
          {...{ ...paymentCompProps, updatedPaymentInfo: true }}
        />,
      );
      await userEvent.type(screen.getByLabelText(/First Name/i), "John");
      await userEvent.type(screen.getByLabelText(/Last Name/i), "Doe");
      await userEvent.click(
        screen.getByRole("button", { name: /Continue to Pay/i }),
      );
    }

    it("should replace the stripe customer and set the pick plan info", async () => {
      await fillAndSubmit();
      await waitFor(() => {
        expect(deleteCustomerFnMock).toHaveBeenCalledWith({
          customerId: "stripeCustomerId",
        });
        expect(createCustomerFnMock).toHaveBeenCalled();
      });
      expect(createCustomerFnMock.mock.calls[0][0]).toEqual({
        firstName: "John",
        lastName: "Doe",
        email: "example@example.com",
        address: {
          line1: "754 Broadway",
          city: "Newburgh",
          state: "NY",
          postal_code: "12550",
          country: "USA",
        },
        userId: "123",
      });
      createCustomerFnMock.mock.calls[0][1].onSuccess({ id: "cus_new" });
      await waitFor(() => {
        expect(setPickPlanInfoMock).toHaveBeenCalledWith(
          expect.objectContaining({
            plan: "1",
            firstName: "John",
            lastName: "Doe",
            customerId: "cus_new",
          }),
        );
      });
    });

    it("should show the error when creating the customer fails", async () => {
      await fillAndSubmit();
      await waitFor(() => {
        expect(createCustomerFnMock).toHaveBeenCalled();
      });
      createCustomerFnMock.mock.calls[0][1].onError(new Error("Stripe down"));
      await waitFor(() => {
        expect(screen.getByText("Error: Stripe down")).toBeInTheDocument();
      });
    });

    it("should reset the profile plan to Seed once the old customer is deleted", async () => {
      await fillAndSubmit();
      await waitFor(() => expect(createCustomerFnMock).toHaveBeenCalled());
      expect(updateUserProfilePlanMock).toHaveBeenCalledWith({
        userId: "123",
        plan: 1,
      });
    });

    it("should stop before creating a customer when the plan reset fails", async () => {
      updateUserProfilePlanMock.mockResolvedValueOnce({
        data: null,
        error: new Error("db"),
      });
      await fillAndSubmit();
      await waitFor(() => {
        expect(
          screen.getByText(
            "Error: Failed to process payment information. Please try again.",
          ),
        ).toBeInTheDocument();
      });
      expect(createCustomerFnMock).not.toHaveBeenCalled();
    });

    it("should show an error when deleting the old customer fails", async () => {
      deleteCustomerFnMock.mockRejectedValueOnce(new Error("nope"));
      await fillAndSubmit();
      await waitFor(() => {
        expect(
          screen.getByText(
            "Error: Failed to process payment information. Please try again.",
          ),
        ).toBeInTheDocument();
      });
      expect(createCustomerFnMock).not.toHaveBeenCalled();
    });
  });
});
