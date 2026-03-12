import { render, screen, waitFor, act } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { expect, vi } from "vitest";

// components
import MyBilling from "../../../src/features/account/MyBilling";
// context
import { useGlobalContext } from "../../../src/context/GlobalContext";

// hooks
import useGetUserLimits from "../../../src/hooks/useGetUserLimits";

// services

// fixtures
import { authUserProfileResponse } from "../../fixtures/authentication/login";

// userEvent

// mocks
const setShowCancelSubscriptionModal = vi.fn();
const setCancelSubscriptionModalType = vi.fn();
const setCustomerId = vi.fn();
let mockCanUpgrade = true;
const mockUser = {
  customers: [
    {
      customerId: "stripeCustomerId",
      subscriptionId: "stripeSubscriptionId",
      subscriptionStatus: "active",
    },
  ],
  plan: authUserProfileResponse.plan,
  typeOfUser: "individual",
  firstName: "John",
  lastName: "Doe",
  email: "john@example.com",
  phone: "123456789",
  address: { formatted_address: "123 Main St" },
  website: "https://john.com",
};

vi.mock("../../../src/context/GlobalContext", () => ({
  useGlobalContext: vi.fn(),
}));
vi.mock("../../../src/hooks/useGetUserLimits");

describe("MyBilling", () => {
  beforeEach(() => {
    (useGlobalContext as any).mockReturnValue({
      user: mockUser,
      setShowCancelSubscriptionModal,
      setCancelSubscriptionModalType,
      setCustomerId,
    });
    (useGetUserLimits as any).mockReturnValue({
      canUpgrade: mockCanUpgrade,
    });
  });
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders billing info and cancel subscription button", async () => {
    render(<MyBilling />);
    const billingInfo = screen.getByText("Billing Information");
    const cancelSubscriptionButton = screen.getByRole("button", {
      name: "Cancel Subscription",
    });
    await waitFor(() => {
      expect(billingInfo).toBeInTheDocument();
      expect(cancelSubscriptionButton).toBeInTheDocument();
    });

    await act(async () => {
      await userEvent.click(cancelSubscriptionButton);
    });
    await waitFor(() => {
      expect(setShowCancelSubscriptionModal).toHaveBeenCalledWith(true);
      expect(setCancelSubscriptionModalType).toHaveBeenCalledWith("onAccount");
      expect(setCustomerId).toHaveBeenCalledWith("stripeCustomerId");
    });
  });
});
