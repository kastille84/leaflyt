import {
  loginUser,
  deleteUser,
  loginUserWithAccessToken,
  signupUser,
  forgotPassword,
  updatePassword,
  sendWelcomeEmail,
  sendDeletedUserEmail,
} from "../../src/services/apiAuth";
import { supabase } from "../../src/services/supabase";
import { queueFrom } from "./supabaseMock";

vi.mock("../../src/services/supabase", () => ({
  supabase: {
    from: vi.fn(),
    rpc: vi.fn(),
    auth: {
      signInWithPassword: vi.fn(),
      getSession: vi.fn(),
      signOut: vi.fn(),
      getUser: vi.fn(),
      signUp: vi.fn(),
      resetPasswordForEmail: vi.fn(),
      updateUser: vi.fn(),
    },
  },
}));

const from = supabase.from as any;
const auth = supabase.auth as any;
const fetchMock = vi.fn();

describe("apiAuth", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe("loginUser", () => {
    beforeEach(() => {
      auth.signInWithPassword.mockResolvedValue({ data: {}, error: null });
    });

    it("returns the profile when the user has no customers", async () => {
      const profile = { id: 1 };
      const [query] = queueFrom(from, { data: profile, error: null });
      const result = await loginUser("a@b.c", "pw");
      expect(auth.signInWithPassword).toHaveBeenCalledWith({
        email: "a@b.c",
        password: "pw",
      });
      expect(query.eq).toHaveBeenCalledWith("email", "a@b.c");
      expect(result).toEqual({ data: profile, error: null });
    });

    it("returns the error when sign in fails", async () => {
      const error = { message: "bad creds" };
      auth.signInWithPassword.mockResolvedValue({ data: null, error });
      expect(await loginUser("a@b.c", "pw")).toEqual({ data: null, error });
    });

    it("returns the error when the profile lookup fails", async () => {
      const error = { message: "no profile" };
      queueFrom(from, { data: null, error });
      expect(await loginUser("a@b.c", "pw")).toEqual({ data: null, error });
    });

    it("flags unpaid subscriptions", async () => {
      const profile = { id: 1, customers: [{ subscriptionStatus: "unpaid" }] };
      queueFrom(from, { data: profile, error: null });
      expect(await loginUser("a@b.c", "pw")).toEqual({
        data: profile,
        error: { message: "unpaid" },
      });
    });

    it("keeps the plan when it matches the customer product", async () => {
      const profile = {
        id: 1,
        plan: { stripeProductId: "p1" },
        customers: [{ subscriptionStatus: "active", productId: "p1" }],
      };
      queueFrom(from, { data: profile, error: null });
      const result = await loginUser("a@b.c", "pw");
      expect(from).toHaveBeenCalledTimes(1);
      expect(result.data.plan).toEqual({ stripeProductId: "p1" });
    });

    it("syncs the plan when it differs from the customer product", async () => {
      const profile: any = {
        id: 1,
        plan: { stripeProductId: "old" },
        customers: [{ subscriptionStatus: "active", productId: "new" }],
      };
      const [, plansQuery, updateQuery] = queueFrom(
        from,
        { data: profile, error: null },
        { data: { id: 7, stripeProductId: "new" }, error: null },
        { data: null, error: null },
      );
      const result = await loginUser("a@b.c", "pw");
      expect(plansQuery.eq).toHaveBeenCalledWith("stripeProductId", "new");
      expect(updateQuery.update).toHaveBeenCalledWith({ plan: 7 });
      expect(updateQuery.eq).toHaveBeenCalledWith("id", 1);
      expect(result.data.plan).toEqual({ id: 7, stripeProductId: "new" });
    });
  });

  describe("deleteUser", () => {
    it("calls the delete endpoint with the session token and signs out", async () => {
      auth.getSession.mockResolvedValue({
        data: { session: { access_token: "tok" } },
      });
      const response = { ok: true };
      fetchMock.mockResolvedValue(response);
      const result = await deleteUser();
      const [url, options] = fetchMock.mock.calls[0];
      expect(url).toMatch(/\/api\/auth\/delete-user$/);
      expect(options.method).toBe("DELETE");
      expect(options.headers.token).toBe("tok");
      expect(auth.signOut).toHaveBeenCalled();
      expect(result).toBe(response);
    });

    it("returns the error when the request fails", async () => {
      auth.getSession.mockResolvedValue({ data: { session: null } });
      const error = new Error("network");
      fetchMock.mockRejectedValue(error);
      expect(await deleteUser()).toEqual({ data: null, error });
    });
  });

  describe("loginUserWithAccessToken", () => {
    beforeEach(() => {
      auth.getUser.mockResolvedValue({
        data: { user: { email: "a@b.c" } },
        error: null,
      });
    });

    it("returns the profile of the current user", async () => {
      const profile = { id: 1, customers: [] };
      const [query] = queueFrom(from, { data: profile, error: null });
      const result = await loginUserWithAccessToken();
      expect(query.eq).toHaveBeenCalledWith("email", "a@b.c");
      expect(result).toEqual({ data: profile, error: null });
    });

    it("returns the error when there is no current user", async () => {
      const error = { message: "no user" };
      auth.getUser.mockResolvedValue({ data: null, error });
      expect(await loginUserWithAccessToken()).toEqual({ data: null, error });
    });

    it("returns an error when the profile cannot be fetched", async () => {
      queueFrom(from, { data: null, error: { message: "x" } });
      const result = await loginUserWithAccessToken();
      expect(result.data).toBeNull();
      expect((result.error as Error).message).toBe(
        "Could not fetch user profile",
      );
    });

    it("flags unpaid subscriptions", async () => {
      const profile = { customers: [{ subscriptionStatus: "unpaid" }] };
      queueFrom(from, { data: profile, error: null });
      expect(await loginUserWithAccessToken()).toEqual({
        data: profile,
        error: { message: "unpaid" },
      });
    });
  });

  describe("paid plan without a subscription", () => {
    const freePlan = { id: 1, name: "Seed" };
    const paidProfile = () => ({
      id: "u1",
      plan: { id: 3, name: "Grove" },
      customers: [],
    });

    it.each([
      [
        "loginUser",
        () => {
          auth.signInWithPassword.mockResolvedValue({ data: {}, error: null });
          return loginUser("a@b.c", "pw");
        },
      ],
      [
        "loginUserWithAccessToken",
        () => {
          auth.getUser.mockResolvedValue({
            data: { user: { email: "a@b.c" } },
            error: null,
          });
          return loginUserWithAccessToken();
        },
      ],
    ])("%s resets the plan to Seed", async (_name, run) => {
      const [, , updateQuery] = queueFrom(
        from,
        { data: paidProfile(), error: null },
        { data: freePlan, error: null },
        { data: null, error: null },
      );
      const result: any = await run();
      expect(updateQuery.update).toHaveBeenCalledWith({ plan: 1 });
      expect(updateQuery.eq).toHaveBeenCalledWith("id", "u1");
      expect(result.data.plan).toEqual(freePlan);
    });

    it("leaves powerUser accounts alone", async () => {
      auth.signInWithPassword.mockResolvedValue({ data: {}, error: null });
      queueFrom(from, {
        data: { ...paidProfile(), powerUser: true },
        error: null,
      });
      const result: any = await loginUser("a@b.c", "pw");
      expect(result.data.plan.id).toBe(3);
      expect(from).toHaveBeenCalledTimes(1);
    });

    it("keeps the plan when the reset update fails", async () => {
      auth.signInWithPassword.mockResolvedValue({ data: {}, error: null });
      queueFrom(
        from,
        { data: paidProfile(), error: null },
        { data: freePlan, error: null },
        { data: null, error: { message: "db" } },
      );
      const result: any = await loginUser("a@b.c", "pw");
      expect(result.data.plan.id).toBe(3);
    });

    it("keeps the plan when the free plan cannot be found", async () => {
      auth.signInWithPassword.mockResolvedValue({ data: {}, error: null });
      queueFrom(
        from,
        { data: paidProfile(), error: null },
        { data: null, error: null },
      );
      const result: any = await loginUser("a@b.c", "pw");
      expect(result.data.plan.id).toBe(3);
    });
  });

  describe("signupUser", () => {
    const contact = {
      email: "a@b.c",
      phone: "1",
      website: "w",
    };
    const base = {
      password: "pw",
      terms: true,
      addressObjToSave: { formatted_address: "1 Main" },
    };

    beforeEach(() => {
      auth.signUp.mockResolvedValue({
        data: { user: { id: "auth1" } },
        error: null,
      });
      fetchMock.mockResolvedValue({ json: async () => ({ data: "created" }) });
    });

    it("signs up an individual using first and last name", async () => {
      const result = await signupUser({
        ...base,
        typeOfUser: "individual",
        individual: { contact, name: { firstName: "F", lastName: "L" } },
      } as any);

      const signUpArgs = auth.signUp.mock.calls[0][0];
      expect(signUpArgs.email).toBe("a@b.c");
      expect(signUpArgs.password).toBe("pw");
      expect(signUpArgs.options.emailRedirectTo).toContain(
        "typeOfUser=individual&name=null&firstName=F&lastName=L",
      );
      const [url, options] = fetchMock.mock.calls[0];
      expect(url).toMatch(/\/api\/auth\/signup$/);
      expect(JSON.parse(options.body)).toMatchObject({
        firstName: "F",
        lastName: "L",
        name: null,
        email: "a@b.c",
        typeOfUser: "individual",
        user: "auth1",
        termsAccepted: true,
      });
      expect(result).toEqual({ data: "created" });
    });

    it.each(["business", "organization"])(
      "signs up a %s using a single name",
      async (type) => {
        await signupUser({
          ...base,
          typeOfUser: type,
          [type]: { contact, name: "Acme" },
        } as any);
        expect(auth.signUp.mock.calls[0][0].options.emailRedirectTo).toContain(
          "name=Acme&firstName=null&lastName=null",
        );
        expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toMatchObject({
          name: "Acme",
          firstName: null,
          lastName: null,
        });
      },
    );

    it("returns the error when auth sign up fails", async () => {
      const error = { message: "taken" };
      auth.signUp.mockResolvedValue({ data: null, error });
      const result = await signupUser({
        ...base,
        typeOfUser: "business",
        business: { contact, name: "Acme" },
      } as any);
      expect(result).toEqual({ data: null, error });
      expect(fetchMock).not.toHaveBeenCalled();
    });

    it("returns the error from the signup endpoint", async () => {
      fetchMock.mockResolvedValue({ json: async () => ({ error: "bad" }) });
      const result = await signupUser({
        ...base,
        typeOfUser: "business",
        business: { contact, name: "Acme" },
      } as any);
      expect(result).toEqual({ data: null, error: "bad" });
    });
  });

  describe("forgotPassword", () => {
    it("requests a reset email", async () => {
      auth.resetPasswordForEmail.mockResolvedValue({
        data: { sent: true },
        error: null,
      });
      expect(await forgotPassword("a@b.c")).toEqual({ sent: true });
      expect(auth.resetPasswordForEmail.mock.calls[0][1].redirectTo).toMatch(
        /\/dashboard\/update-password$/,
      );
    });

    it("returns the error on failure", async () => {
      const error = { message: "bad" };
      auth.resetPasswordForEmail.mockResolvedValue({ data: null, error });
      expect(await forgotPassword("a@b.c")).toEqual({ data: null, error });
    });
  });

  describe("updatePassword", () => {
    it("updates the password", async () => {
      auth.updateUser.mockResolvedValue({ data: { ok: 1 }, error: null });
      expect(await updatePassword("new")).toEqual({ ok: 1 });
      expect(auth.updateUser).toHaveBeenCalledWith({ password: "new" });
    });

    it("returns the error on failure", async () => {
      const error = { message: "bad" };
      auth.updateUser.mockResolvedValue({ data: null, error });
      expect(await updatePassword("new")).toEqual({ data: null, error });
    });
  });

  describe.each([
    [
      "sendWelcomeEmail",
      sendWelcomeEmail,
      /\/api\/email\/send-welcome-email$/,
      { email: "a", typeOfUser: "t", name: "n", firstName: "f", lastName: "l" },
    ],
    [
      "sendDeletedUserEmail",
      sendDeletedUserEmail,
      /\/api\/email\/send-deleted-user-email$/,
      { email: "a", name: "n", firstName: "f", lastName: "l" },
    ],
  ] as const)("%s", (_name, fn, urlPattern, args) => {
    it("posts the details and returns the result", async () => {
      fetchMock.mockResolvedValue({ json: async () => ({ sent: true }) });
      expect(await (fn as any)(args)).toEqual({ sent: true });
      const [url, options] = fetchMock.mock.calls[0];
      expect(url).toMatch(urlPattern);
      expect(JSON.parse(options.body)).toEqual(args);
    });

    it("returns an error when the response has one", async () => {
      fetchMock.mockResolvedValue({ json: async () => ({ error: "bad" }) });
      expect(await (fn as any)(args)).toEqual({ data: null, error: "bad" });
    });

    it("returns an error when the request throws", async () => {
      const error = new Error("network");
      fetchMock.mockRejectedValue(error);
      expect(await (fn as any)(args)).toEqual({ data: null, error });
    });
  });
});
