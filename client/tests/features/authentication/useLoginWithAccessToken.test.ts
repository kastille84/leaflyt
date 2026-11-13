import { renderHook, waitFor, act } from "@testing-library/react";
import useLoginWithAccessToken from "../../../src/features/authentication/useLoginWithAccessToken";
import { loginUserWithAccessToken } from "../../../src/services/apiAuth";
import { QueryClientProviderWrapper } from "../../test-utils";

vi.mock("../../../src/services/apiAuth", () => ({
  loginUserWithAccessToken: vi.fn(),
}));

describe("useLoginWithAccessToken", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("autoLogin calls loginUserWithAccessToken", async () => {
    vi.mocked(loginUserWithAccessToken).mockResolvedValue({} as any);
    const { result } = renderHook(() => useLoginWithAccessToken(), {
      wrapper: QueryClientProviderWrapper(),
    });
    act(() => result.current.autoLogin("token"));
    await waitFor(() => expect(loginUserWithAccessToken).toHaveBeenCalled());
  });

  it("exposes loginError on failure", async () => {
    vi.mocked(loginUserWithAccessToken).mockRejectedValue(new Error("boom"));
    const { result } = renderHook(() => useLoginWithAccessToken(), {
      wrapper: QueryClientProviderWrapper(),
    });
    act(() => result.current.autoLogin("token"));
    await waitFor(() => expect(result.current.loginError).toBeTruthy());
  });
});
