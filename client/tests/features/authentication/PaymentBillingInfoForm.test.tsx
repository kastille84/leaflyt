import { render, screen, waitFor, act } from "@testing-library/react";
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
import { parseAdrAddress } from "../../../src/utils/ServiceUtils";
import { email } from "../../../../server/middlewares/validators/auth";
// fixtures
// userEvent

// mocks
vi.mock("../../../src/context/GlobalContext", () => ({
  useGlobalContext: vi.fn(),
}));
vi.mock("../../../src/hooks/useStripe");
vi.mock("../../../src/features/authentication/useSignup");
vi.mock("react-hot-toast");

describe("PaymentBillingInfoForm", () => {
  const createCustomerFnMock = vi.fn();
  const deleteCustomerFnMock = vi.fn();
  const updateUserProfilePlanMock = vi.fn();
  const setPickPlanInfoMock = vi.fn();

  const paymentCompProps: any = {
    signedUpUser: {
      id: "123",
      email: "example@example.com",
      customer: [
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
    act(() => {
      userEvent.click(switchToFreePlanButton);
    });
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
    it("should submit the form successfully", async () => {
      render(
        <PaymentBillingInfoForm
          {...{ ...paymentCompProps, updatedPaymentInfo: true }}
        />,
      );
      const firstNameInput = screen.getByLabelText(/First Name/i);
      const lastNameInput = screen.getByLabelText(/Last Name/i);
      await userEvent.type(firstNameInput, "John");
      await userEvent.type(lastNameInput, "Doe");
      const addressInput = screen.getByLabelText(/Billing Address/i);
      act(async () => {
        await userEvent.type(addressInput, "754 broadway");
      });
      act(async () => {
        userEvent.tab(); // selects first address suggestion
      });
      const submitButton = screen.getByRole("button", {
        name: /Continue to Pay/i,
      });
      await userEvent.click(submitButton);
      await waitFor(() => {
        expect(updateUserProfilePlanMock).toHaveBeenCalledWith({
          userId: "123",
          plan: 1,
        });
      });
      await waitFor(() => {
        expect(setPickPlanInfoMock).toHaveBeenCalled();
      });
    });
  });
});
