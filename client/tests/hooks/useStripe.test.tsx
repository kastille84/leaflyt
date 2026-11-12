import { renderHook, waitFor, act } from "@testing-library/react";
import useStripe from "../../src/hooks/useStripe";
import * as apiStripe from "../../src/services/apiStripe";
import { QueryClientProviderWrapper } from "../test-utils";

vi.mock("../../src/services/apiStripe", () => ({
  createCustomer: vi.fn(),
  createCheckoutSession: vi.fn(),
  deleteCustomer: vi.fn(),
  updateSubscription: vi.fn(),
  updateUserPlan: vi.fn(),
}));

const mocked = apiStripe as any;

describe("useStripe", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const setup = () =>
    renderHook(() => useStripe(), { wrapper: QueryClientProviderWrapper() });

  it.each([
    ["createCustomerFn", "createCustomer"],
    ["deleteCustomerFn", "deleteCustomer"],
    ["updateSubscriptionFn", "updateSubscription"],
    ["createCheckoutSessionFn", "createCheckoutSession"],
  ])("%s calls %s with the payload", async (hookFn, serviceFn) => {
    mocked[serviceFn].mockResolvedValue({});
    const { result } = setup();
    act(() => (result.current as any)[hookFn]({ a: 1 }));
    await waitFor(() => expect(mocked[serviceFn]).toHaveBeenCalled());
    expect(mocked[serviceFn].mock.calls[0][0]).toEqual({ a: 1 });
  });

  it("deleteCustomerAsync resolves with the service result", async () => {
    mocked.deleteCustomer.mockResolvedValue("ok");
    const { result } = setup();
    let value;
    await act(async () => {
      value = await result.current.deleteCustomerAsync({ id: "c1" });
    });
    expect(value).toBe("ok");
  });

  it("updateUserPlanFn passes userId and plan", async () => {
    mocked.updateUserPlan.mockResolvedValue({});
    const { result } = setup();
    act(() => result.current.updateUserPlanFn({ userId: "u1", plan: "pro" }));
    await waitFor(() =>
      expect(mocked.updateUserPlan).toHaveBeenCalledWith("u1", "pro"),
    );
  });

  it("exposes the error when a mutation fails", async () => {
    mocked.createCustomer.mockRejectedValue(new Error("fail"));
    const { result } = setup();
    act(() => result.current.createCustomerFn({}));
    await waitFor(() =>
      expect(result.current.createCustomerFnError).toBeTruthy(),
    );
  });
});
