import {
  createCustomer,
  deleteCustomer,
  updateSubscription,
  createCheckoutSession,
  updateUserPlan,
} from "../../src/services/apiStripe";
import { supabase } from "../../src/services/supabase";
import { queueFrom } from "./supabaseMock";

vi.mock("../../src/services/supabase", () => ({
  supabase: { from: vi.fn() },
}));

const from = supabase.from as any;
const fetchMock = vi.fn();

describe("apiStripe", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe("createCustomer", () => {
    const args = {
      firstName: "F",
      lastName: "L",
      email: "a@b.c",
      address: { line1: "1" },
      userId: "u1",
    };

    it("posts the customer and returns the data", async () => {
      fetchMock.mockResolvedValue({ json: async () => ({ data: { id: "c1" } }) });
      expect(await createCustomer(args)).toEqual({ id: "c1" });
      const [url, options] = fetchMock.mock.calls[0];
      expect(url).toMatch(/\/api\/stripe\/create-customer$/);
      expect(options.method).toBe("POST");
      expect(JSON.parse(options.body)).toEqual(args);
    });

    it("returns the error when the request fails", async () => {
      const error = new Error("network");
      fetchMock.mockRejectedValue(error);
      expect(await createCustomer(args)).toEqual({ data: null, error });
    });
  });

  describe("deleteCustomer", () => {
    it("deletes the customer and returns the data", async () => {
      fetchMock.mockResolvedValue({
        ok: true,
        json: async () => ({ data: "gone" }),
      });
      expect(await deleteCustomer({ customerId: "c1" })).toBe("gone");
      const [url, options] = fetchMock.mock.calls[0];
      expect(url).toMatch(/\/api\/stripe\/delete-customer$/);
      expect(options.method).toBe("DELETE");
      expect(options.headers.customerid).toBe("c1");
    });

    it("returns the error when the request fails", async () => {
      const error = new Error("network");
      fetchMock.mockRejectedValue(error);
      expect(await deleteCustomer({ customerId: "c1" })).toEqual({
        data: null,
        error,
      });
    });

    it("returns an error when the server responds with a failure", async () => {
      fetchMock.mockResolvedValue({ ok: false, json: async () => ({}) });
      const result: any = await deleteCustomer({ customerId: "c1" });
      expect(result.data).toBeNull();
      expect(result.error).toBeInstanceOf(Error);
    });
  });

  describe("updateSubscription", () => {
    const args = { subscriptionId: "s1", plan: "2", userId: "u1" };

    it("updates the subscription and the user plan", async () => {
      fetchMock.mockResolvedValue({ ok: true, json: async () => ({}) });
      const [query] = queueFrom(from, { data: { id: "u1" }, error: null });
      expect(await updateSubscription(args)).toEqual({
        user: { id: "u1" },
        error: null,
      });
      const [url, options] = fetchMock.mock.calls[0];
      expect(url).toMatch(/\/api\/stripe\/update-subscription$/);
      expect(JSON.parse(options.body)).toEqual({
        subscriptionId: "s1",
        newPlan: "2",
      });
      expect(query.update).toHaveBeenCalledWith({ plan: "2" });
      expect(query.eq).toHaveBeenCalledWith("id", "u1");
    });

    it("returns the error when the request fails", async () => {
      const error = new Error("network");
      fetchMock.mockRejectedValue(error);
      expect(await updateSubscription(args)).toEqual({ data: null, error });
    });

    it("does not touch the user plan when Stripe rejects the change", async () => {
      fetchMock.mockResolvedValue({ ok: false, json: async () => ({}) });
      const result: any = await updateSubscription(args);
      expect(result.data).toBeNull();
      expect(result.error).toBeInstanceOf(Error);
      expect(from).not.toHaveBeenCalled();
    });

    it("returns the error when saving the plan in supabase fails", async () => {
      fetchMock.mockResolvedValue({ ok: true, json: async () => ({}) });
      const dbError = { message: "db" };
      queueFrom(from, { data: null, error: dbError });
      expect(await updateSubscription(args)).toEqual({
        data: null,
        error: dbError,
      });
    });
  });

  describe("createCheckoutSession", () => {
    it("returns the session response", async () => {
      fetchMock.mockResolvedValue({
        json: async () => ({ clientSecret: "secret" }),
      });
      expect(
        await createCheckoutSession({ plan: "2", customerId: "c1" }),
      ).toEqual({ clientSecret: "secret" });
      const [url, options] = fetchMock.mock.calls[0];
      expect(url).toMatch(/\/api\/stripe\/create-checkout-session$/);
      expect(JSON.parse(options.body)).toEqual({ plan: "2", customerId: "c1" });
    });

    it("returns the error when the request fails", async () => {
      const error = new Error("network");
      fetchMock.mockRejectedValue(error);
      expect(
        await createCheckoutSession({ plan: "2", customerId: "c1" }),
      ).toEqual({ data: null, error });
    });
  });

  describe("updateUserPlan", () => {
    it("updates the plan and returns the user", async () => {
      const [query] = queueFrom(from, { data: { id: "u1" }, error: null });
      expect(await updateUserPlan("u1", "3")).toEqual({
        user: { id: "u1" },
        error: null,
      });
      expect(query.update).toHaveBeenCalledWith({ plan: "3" });
    });

    it("returns the error when the update fails", async () => {
      const error = { message: "bad" };
      queueFrom(from, { data: null, error });
      expect(await updateUserPlan("u1", "3")).toEqual({ data: null, error });
    });
  });
});
