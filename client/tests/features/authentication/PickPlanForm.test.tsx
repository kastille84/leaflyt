import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import toast from "react-hot-toast";

import PickPlanForm from "../../../src/features/authentication/PickPlanForm";
import * as GlobalContext from "../../../src/context/GlobalContext";
import useStripe from "../../../src/hooks/useStripe";

// fixtures
import { mockUseGlobalContextReturnObj } from "../../fixtures/context/globalContext";

// mocks
vi.mock("../../../src/context/GlobalContext");
vi.mock("../../../src/hooks/useStripe");
vi.mock("react-hot-toast", () => ({
  default: { success: vi.fn(), error: vi.fn() },
}));
vi.mock("../../../src/utils/ServiceUtils", async (importOriginal) => ({
  ...(await importOriginal<typeof import("../../../src/utils/ServiceUtils")>()),
  parseAdrAddress: vi.fn(() => ({ street: "1 Main St" })),
}));
vi.mock("../../../src/ui/Plan/PlansInputContainer", () => ({
  default: ({ setValue }: any) => (
    <div>
      <button type="button" onClick={() => setValue("plan", "1")}>
        pick-free
      </button>
      <button type="button" onClick={() => setValue("plan", "2")}>
        pick-paid
      </button>
    </div>
  ),
}));
vi.mock("../../../src/ui/Form/FirstNameInput", () => ({
  default: ({ register, registerName }: any) => (
    <input data-testid="first-name" {...register(registerName)} />
  ),
}));
vi.mock("../../../src/ui/Form/LastNameInput", () => ({
  default: ({ register, registerName }: any) => (
    <input data-testid="last-name" {...register(registerName)} />
  ),
}));
vi.mock("../../../src/ui/Form/AddressInput", () => ({
  default: ({ setValue }: any) => (
    <button
      type="button"
      onClick={() => setValue("addressObjToSave", { adr_address: "<adr>" })}
    >
      set-address
    </button>
  ),
}));

const user = userEvent.setup();

describe("PickPlanForm", () => {
  const setBottomSlideInTypeMock = vi.fn();
  const setIsOpenBottomSlideInMock = vi.fn();
  const setUserMock = vi.fn();
  const createCustomerFnMock = vi.fn();
  const updateSubscriptionFnMock = vi.fn();
  const setPickPlanInfoMock = vi.fn();
  const signedUpUser: any = {
    id: "u1",
    email: "a@b.com",
    plan: { name: "Seed" },
    customers: [{ subscriptionId: "sub_1" }],
  };

  function renderForm(props: any = {}) {
    return render(
      <PickPlanForm
        signedUpUser={signedUpUser}
        setPickPlanInfo={setPickPlanInfoMock}
        {...props}
      />,
    );
  }

  beforeEach(() => {
    vi.mocked(GlobalContext.useGlobalContext).mockImplementation(() => ({
      ...mockUseGlobalContextReturnObj,
      setBottomSlideInType: setBottomSlideInTypeMock,
      setIsOpenBottomSlideIn: setIsOpenBottomSlideInMock,
      setUser: setUserMock,
    }));
    vi.mocked(useStripe).mockReturnValue({
      createCustomerFn: createCustomerFnMock,
      updateSubscriptionFn: updateSubscriptionFnMock,
    } as any);
  });
  afterEach(() => {
    vi.clearAllMocks();
    createCustomerFnMock.mockReset();
    updateSubscriptionFnMock.mockReset();
  });

  async function fillSignup() {
    await user.click(screen.getByText("pick-paid"));
    await user.type(await screen.findByTestId("first-name"), "Jane");
    await user.type(screen.getByTestId("last-name"), "Doe");
    await user.click(screen.getByText("set-address"));
  }

  it("shows the free plan button and hides the account holder fields by default", () => {
    renderForm();
    expect(screen.getByText("Next, Select a Plan.")).toBeTruthy();
    expect(screen.getByText("Try Seed Plan for Free")).toBeTruthy();
    expect(screen.queryByText("Account Holder Information")).toBeNull();
    expect(screen.queryByText("Current Plan:")).toBeNull();
  });

  it("closes the slide-in and toasts when trying the free plan", async () => {
    renderForm();
    await user.click(screen.getByText("Try Seed Plan for Free"));
    expect(setIsOpenBottomSlideInMock).toHaveBeenCalledWith(false);
    expect(setBottomSlideInTypeMock).toHaveBeenCalledWith(null);
    expect(toast.success).toHaveBeenCalled();
  });

  it("closes the slide-in when cancel is clicked", async () => {
    renderForm();
    await user.click(screen.getByText("Cancel"));
    expect(setIsOpenBottomSlideInMock).toHaveBeenCalledWith(false);
    expect(setBottomSlideInTypeMock).toHaveBeenCalledWith(null);
  });

  it("shows the account holder fields when a paid plan is picked", async () => {
    renderForm();
    await user.click(screen.getByText("pick-paid"));
    expect(await screen.findByText("Account Holder Information")).toBeTruthy();
    expect(screen.queryByText("Try Seed Plan for Free")).toBeNull();
  });

  it("hides the account holder fields when switching back to the free plan", async () => {
    renderForm();
    await user.click(screen.getByText("pick-paid"));
    await screen.findByText("Account Holder Information");
    await user.click(screen.getByText("pick-free"));
    await waitFor(() =>
      expect(screen.queryByText("Account Holder Information")).toBeNull(),
    );
  });

  it("creates a customer on signup and passes the plan info on success", async () => {
    createCustomerFnMock.mockImplementation((_data, { onSuccess }) =>
      onSuccess({ id: "cus_1" }),
    );
    const { container } = renderForm();
    await fillSignup();
    await act(async () => {
      fireEvent.submit(container.querySelector("form")!);
    });
    await waitFor(() => expect(createCustomerFnMock).toHaveBeenCalled());
    expect(createCustomerFnMock.mock.calls[0][0]).toEqual({
      firstName: "Jane",
      lastName: "Doe",
      email: "a@b.com",
      address: { street: "1 Main St" },
      userId: "u1",
    });
    expect(setPickPlanInfoMock).toHaveBeenCalledWith({
      plan: "2",
      firstName: "Jane",
      lastName: "Doe",
      address: { street: "1 Main St" },
      customerId: "cus_1",
    });
    expect(screen.queryByText("Configuring your plan...")).toBeNull();
  });

  it("shows the error when creating the customer fails", async () => {
    createCustomerFnMock.mockImplementation((_data, { onError }) =>
      onError(new Error("Customer failed")),
    );
    const { container } = renderForm();
    await fillSignup();
    await act(async () => {
      fireEvent.submit(container.querySelector("form")!);
    });
    expect(await screen.findByText("Error: Customer failed")).toBeTruthy();
    expect(setPickPlanInfoMock).not.toHaveBeenCalled();
  });

  it("shows the spinner while the customer is being created", async () => {
    const { container } = renderForm();
    await fillSignup();
    await act(async () => {
      fireEvent.submit(container.querySelector("form")!);
    });
    expect(await screen.findByText("Configuring your plan...")).toBeTruthy();
  });

  it("shows the current plan and Continue to Pay when upgrading from free", async () => {
    renderForm({ isUpgrade: true, currentPlanId: 1 });
    expect(screen.getByText("Seed")).toBeTruthy();
    expect(screen.getByText("Continue to Pay")).toBeTruthy();
    expect(screen.queryByText("Try Seed Plan for Free")).toBeNull();
    await user.click(screen.getByText("pick-paid"));
    expect(await screen.findByText("Account Holder Information")).toBeTruthy();
  });

  it("creates a customer when upgrading from the free plan", async () => {
    createCustomerFnMock.mockImplementation((_data, { onSuccess }) =>
      onSuccess({ id: "cus_1" }),
    );
    renderForm({ isUpgrade: true, currentPlanId: 1 });
    await fillSignup();
    await user.click(screen.getByText("Continue to Pay"));
    await waitFor(() => expect(createCustomerFnMock).toHaveBeenCalled());
    expect(updateSubscriptionFnMock).not.toHaveBeenCalled();
  });

  it("updates the subscription when upgrading from a paid plan", async () => {
    updateSubscriptionFnMock.mockImplementation((_data, { onSuccess }) =>
      onSuccess({ user: { id: "u1", plan: 3 } }),
    );
    renderForm({ isUpgrade: true, isAnyPaidPlan: true, currentPlanId: 2 });
    expect(screen.queryByText("Account Holder Information")).toBeNull();
    await user.click(screen.getByText("pick-paid"));
    await user.click(screen.getByText("Finalize New Plan"));
    await waitFor(() => expect(updateSubscriptionFnMock).toHaveBeenCalled());
    expect(updateSubscriptionFnMock.mock.calls[0][0]).toEqual({
      plan: "2",
      subscriptionId: "sub_1",
      userId: "u1",
    });
    expect(createCustomerFnMock).not.toHaveBeenCalled();
    expect(setUserMock).toHaveBeenCalledWith({ id: "u1", plan: 3 });
    expect(toast.success).toHaveBeenCalledWith(
      "Plan updated! \nEnjoy your new plan!",
      { duration: 8000 },
    );
    expect(setIsOpenBottomSlideInMock).toHaveBeenCalledWith(false);
    expect(setBottomSlideInTypeMock).toHaveBeenCalledWith(null);
  });

  it("shows the error when updating the subscription fails", async () => {
    updateSubscriptionFnMock.mockImplementation((_data, { onError }) =>
      onError(new Error("Update failed")),
    );
    renderForm({ isUpgrade: true, isAnyPaidPlan: true, currentPlanId: 2 });
    await user.click(screen.getByText("Finalize New Plan"));
    expect(await screen.findByText("Error: Update failed")).toBeTruthy();
    expect(setUserMock).not.toHaveBeenCalled();
  });
});
