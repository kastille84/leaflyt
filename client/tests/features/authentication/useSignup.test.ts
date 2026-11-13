import { renderHook, waitFor, act } from "@testing-library/react";
import useSignup from "../../../src/features/authentication/useSignup";
import {
  signupUser,
  sendWelcomeEmail,
  deleteUser,
  sendDeletedUserEmail,
} from "../../../src/services/apiAuth";
import { updateUserProfilePlan } from "../../../src/services/apiUser";
import { QueryClientProviderWrapper } from "../../test-utils";

vi.mock("../../../src/services/apiAuth", () => ({
  signupUser: vi.fn(),
  sendWelcomeEmail: vi.fn(),
  deleteUser: vi.fn(),
  sendDeletedUserEmail: vi.fn(),
}));
vi.mock("../../../src/services/apiUser", () => ({
  updateUserProfilePlan: vi.fn(),
}));

describe("useSignup", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  function setup() {
    return renderHook(() => useSignup(), {
      wrapper: QueryClientProviderWrapper(),
    });
  }

  it("signup calls signupUser with the submitted data", async () => {
    vi.mocked(signupUser).mockResolvedValue({} as any);
    const { result } = setup();
    const data: any = { email: "a@b.com" };
    act(() => result.current.signup(data));
    await waitFor(() => expect(signupUser).toHaveBeenCalled());
    expect(vi.mocked(signupUser).mock.calls[0][0]).toEqual(data);
  });

  it("signup exposes the error on failure", async () => {
    vi.mocked(signupUser).mockRejectedValue(new Error("boom"));
    const { result } = setup();
    act(() => result.current.signup({} as any));
    await waitFor(() => expect(result.current.signupError).toBeTruthy());
  });

  it("sendWelcomeEmailFn calls sendWelcomeEmail with the email fields", async () => {
    vi.mocked(sendWelcomeEmail).mockResolvedValue({} as any);
    const { result } = setup();
    const data = {
      email: "a@b.com",
      typeOfUser: "business",
      name: "Biz",
      firstName: "A",
      lastName: "B",
    };
    act(() => result.current.sendWelcomeEmailFn(data));
    await waitFor(() => expect(sendWelcomeEmail).toHaveBeenCalledWith(data));
  });

  it("sendWelcomeEmailFn exposes the error on failure", async () => {
    vi.mocked(sendWelcomeEmail).mockRejectedValue(new Error("boom"));
    const { result } = setup();
    act(() =>
      result.current.sendWelcomeEmailFn({
        email: "",
        typeOfUser: "",
        name: "",
        firstName: "",
        lastName: "",
      }),
    );
    await waitFor(() =>
      expect(result.current.sendWelcomeEmailFnError).toBeTruthy(),
    );
  });

  it("deleteUserAsyncFn calls deleteUser", async () => {
    vi.mocked(deleteUser).mockResolvedValue({} as any);
    const { result } = setup();
    await act(async () => {
      await result.current.deleteUserAsyncFn();
    });
    expect(deleteUser).toHaveBeenCalled();
  });

  it("deleteUserAsyncFn exposes the error on failure", async () => {
    vi.mocked(deleteUser).mockRejectedValue(new Error("boom"));
    const { result } = setup();
    await act(async () => {
      await result.current.deleteUserAsyncFn().catch(() => {});
    });
    await waitFor(() =>
      expect(result.current.deleteUserAsyncFnError).toBeTruthy(),
    );
  });

  it("updateUserProfilePlanAsyncFn calls updateUserProfilePlan with the id and plan", async () => {
    vi.mocked(updateUserProfilePlan).mockResolvedValue({} as any);
    const { result } = setup();
    await act(async () => {
      await result.current.updateUserProfilePlanAsyncFn({
        userId: "u1",
        plan: 2,
      });
    });
    expect(updateUserProfilePlan).toHaveBeenCalledWith("u1", 2);
  });

  it("updateUserProfilePlanAsyncFn exposes the error on failure", async () => {
    vi.mocked(updateUserProfilePlan).mockRejectedValue(new Error("boom"));
    const { result } = setup();
    await act(async () => {
      await result.current
        .updateUserProfilePlanAsyncFn({ userId: "u1", plan: 2 })
        .catch(() => {});
    });
    await waitFor(() =>
      expect(result.current.updateUserProfilePlanAsyncFnError).toBeTruthy(),
    );
  });

  it("sendDeletedUserEmailAsyncFn calls sendDeletedUserEmail with the email fields", async () => {
    vi.mocked(sendDeletedUserEmail).mockResolvedValue({} as any);
    const { result } = setup();
    const data = {
      email: "a@b.com",
      name: "Biz",
      firstName: "A",
      lastName: "B",
    };
    await act(async () => {
      await result.current.sendDeletedUserEmailAsyncFn(data);
    });
    expect(sendDeletedUserEmail).toHaveBeenCalledWith(data);
  });

  it("sendDeletedUserEmailAsyncFn exposes the error on failure", async () => {
    vi.mocked(sendDeletedUserEmail).mockRejectedValue(new Error("boom"));
    const { result } = setup();
    await act(async () => {
      await result.current
        .sendDeletedUserEmailAsyncFn({
          email: "",
          name: "",
          firstName: "",
          lastName: "",
        })
        .catch(() => {});
    });
    await waitFor(() =>
      expect(result.current.sendDeletedUserEmailAsyncFnError).toBeTruthy(),
    );
  });
});
