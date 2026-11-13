import { renderHook, waitFor } from "@testing-library/react";
import useGetUserProfileById from "../../src/hooks/useGetUserProfileById";
import { useGlobalContext } from "../../src/context/GlobalContext";
import { getUserProfile } from "../../src/services/apiUser";
import { QueryClientProviderWrapper } from "../test-utils";

vi.mock("../../src/context/GlobalContext", () => ({
  useGlobalContext: vi.fn(),
}));
vi.mock("../../src/services/apiUser", () => ({ getUserProfile: vi.fn() }));

describe("useGetUserProfileById", () => {
  const setUser = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useGlobalContext as any).mockReturnValue({ user: { id: "u1" }, setUser });
  });

  it("fetches the profile and stores it in context when enabled", async () => {
    (getUserProfile as any).mockResolvedValue({
      data: { id: "u1", name: "N" },
    });
    const { result } = renderHook(() => useGetUserProfileById(true), {
      wrapper: QueryClientProviderWrapper(),
    });
    await waitFor(() => expect(result.current.status).toBe("success"));
    expect(getUserProfile).toHaveBeenCalledWith("u1");
    await waitFor(() =>
      expect(setUser).toHaveBeenCalledWith({ id: "u1", name: "N" }),
    );
  });

  it("does not fetch when disabled", () => {
    const { result } = renderHook(() => useGetUserProfileById(false), {
      wrapper: QueryClientProviderWrapper(),
    });
    expect(result.current.status).toBe("pending");
    expect(getUserProfile).not.toHaveBeenCalled();
    expect(setUser).not.toHaveBeenCalled();
  });
});
