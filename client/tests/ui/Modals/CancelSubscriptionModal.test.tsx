import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import toast from "react-hot-toast";
import CancelSubscriptionModal from "../../../src/ui/Modals/CancelSubscriptionModal";
import * as GlobalContext from "../../../src/context/GlobalContext";
import useStripe from "../../../src/hooks/useStripe";
import { mockUseGlobalContextReturnObj } from "../../fixtures/context/globalContext";

vi.mock("../../../src/context/GlobalContext");
vi.mock("../../../src/hooks/useStripe");
vi.mock("react-hot-toast");

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async (importOriginal) => ({
  ...(await importOriginal<typeof import("react-router-dom")>()),
  useNavigate: () => mockNavigate,
}));

describe("CancelSubscriptionModal", () => {
  const setShowCancelSubscriptionModal = vi.fn();
  const setCancelSubscriptionModalType = vi.fn();
  const setCustomerId = vi.fn();
  const setIsOpenBottomSlideIn = vi.fn();
  const setBottomSlideInType = vi.fn();
  const setUser = vi.fn();
  const deleteCustomerFn = vi.fn();
  const updateUserPlanFn = vi.fn();

  function mockContext(type: "onPayment" | "onAccount" | null) {
    vi.mocked(GlobalContext.useGlobalContext).mockImplementation(() => ({
      ...mockUseGlobalContextReturnObj,
      showCancelSubscriptionModal: true,
      setShowCancelSubscriptionModal,
      cancelSubscriptionModalType: type,
      setCancelSubscriptionModalType,
      customerId: "cus_1",
      setCustomerId,
      setIsOpenBottomSlideIn,
      setBottomSlideInType,
      user: { id: "u1" },
      setUser,
    }));
  }

  function renderModal() {
    return render(
      <BrowserRouter>
        <CancelSubscriptionModal />
      </BrowserRouter>,
    );
  }

  function expectResetState() {
    expect(setShowCancelSubscriptionModal).toHaveBeenCalledWith(false);
    expect(setCancelSubscriptionModalType).toHaveBeenCalledWith(null);
    expect(setCustomerId).toHaveBeenCalledWith(null);
    expect(setIsOpenBottomSlideIn).toHaveBeenCalledWith(false);
    expect(setBottomSlideInType).toHaveBeenCalledWith(null);
  }

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useStripe).mockReturnValue({
      deleteCustomerFn,
      updateUserPlanFn,
    } as unknown as ReturnType<typeof useStripe>);
  });

  describe("onPayment", () => {
    beforeEach(() => mockContext("onPayment"));

    it("should explain that the payment will not be charged", () => {
      renderModal();
      expect(
        screen.getByText("By canceling this payment, you will not be charged."),
      ).toBeInTheDocument();
    });

    it("should close on Continue to Pay", async () => {
      renderModal();
      await userEvent.click(
        screen.getByRole("button", { name: "Continue to Pay" }),
      );
      expect(setShowCancelSubscriptionModal).toHaveBeenCalledWith(false);
      expect(deleteCustomerFn).not.toHaveBeenCalled();
    });

    it("should delete the customer and reset state", async () => {
      deleteCustomerFn.mockImplementation((_arg, opts) => opts.onSuccess());
      renderModal();
      await userEvent.click(
        screen.getByRole("button", { name: "Cancel Payment" }),
      );
      expect(deleteCustomerFn).toHaveBeenCalledWith(
        { customerId: "cus_1" },
        expect.any(Object),
      );
      expect(toast.success).toHaveBeenCalled();
      expectResetState();
    });

    it("should show the error when deleting the customer fails", async () => {
      deleteCustomerFn.mockImplementation((_arg, opts) =>
        opts.onError({ message: "stripe down" }),
      );
      renderModal();
      await userEvent.click(
        screen.getByRole("button", { name: "Cancel Payment" }),
      );
      expect(toast.error).toHaveBeenCalledWith("stripe down");
      expect(screen.getByText("Error: stripe down")).toBeInTheDocument();
      expect(
        screen.queryByText("Setting up FREE Seed Plan..."),
      ).not.toBeInTheDocument();
    });

    it("should show the spinner while cancelling", async () => {
      deleteCustomerFn.mockReset();
      renderModal();
      await userEvent.click(
        screen.getByRole("button", { name: "Cancel Payment" }),
      );
      expect(
        screen.getByText("Setting up FREE Seed Plan..."),
      ).toBeInTheDocument();
    });
  });

  describe("onAccount", () => {
    beforeEach(() => mockContext("onAccount"));

    it("should warn that it cannot be undone", () => {
      renderModal();
      expect(
        screen.getByText("Reminder: This cannot be undone."),
      ).toBeInTheDocument();
    });

    it("should close on Stay with Plan", async () => {
      renderModal();
      await userEvent.click(
        screen.getByRole("button", { name: "Stay with Plan" }),
      );
      expect(setShowCancelSubscriptionModal).toHaveBeenCalledWith(false);
    });

    it("should drop the user to the Seed plan and go home", async () => {
      deleteCustomerFn.mockImplementation((_arg, opts) => opts.onSuccess());
      updateUserPlanFn.mockImplementation((_arg, opts) =>
        opts.onSuccess({ user: { id: "u1", plan: 1 } }),
      );
      renderModal();
      await userEvent.click(
        screen.getByRole("button", { name: "Cancel Subscription" }),
      );
      expect(updateUserPlanFn).toHaveBeenCalledWith(
        { userId: "u1", plan: "1" },
        expect.any(Object),
      );
      expect(setUser).toHaveBeenCalledWith({ id: "u1", plan: 1 });
      expectResetState();
      expect(mockNavigate).toHaveBeenCalledWith("/dashboard/home");
    });

    it("should show the error when deleting the customer fails", async () => {
      deleteCustomerFn.mockImplementation((_arg, opts) =>
        opts.onError({ message: "stripe down" }),
      );
      renderModal();
      await userEvent.click(
        screen.getByRole("button", { name: "Cancel Subscription" }),
      );
      expect(screen.getByText("Error: stripe down")).toBeInTheDocument();
      expect(updateUserPlanFn).not.toHaveBeenCalled();
    });

    it("should recover when the delete call throws", async () => {
      vi.spyOn(console, "error").mockImplementation(() => {});
      deleteCustomerFn.mockImplementation(() => {
        throw new Error("sync failure");
      });
      renderModal();
      await userEvent.click(
        screen.getByRole("button", { name: "Cancel Subscription" }),
      );
      expect(console.error).toHaveBeenCalled();
      expect(
        screen.queryByText("Setting up FREE Seed Plan..."),
      ).not.toBeInTheDocument();
    });
  });

  it("should render only the heading without a type, and do nothing on delete", () => {
    mockContext(null);
    renderModal();
    expect(
      screen.getByText("Are you sure you want to cancel this subscription?"),
    ).toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});
