import { renderHook, waitFor } from "@testing-library/react";
import useGetPlans from "../../src/hooks/useGetPlans";
import { getPlans } from "../../src/services/apiPlans";
import { QueryClientProviderWrapper } from "../test-utils";

vi.mock("../../src/services/apiPlans", () => ({ getPlans: vi.fn() }));

describe("useGetPlans", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns plans on success", async () => {
    (getPlans as any).mockResolvedValue([{ id: 1 }]);
    const { result } = renderHook(() => useGetPlans(), {
      wrapper: QueryClientProviderWrapper(),
    });
    expect(result.current.isLoading).toBe(true);
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.plans).toEqual([{ id: 1 }]);
    expect(result.current.error).toBeNull();
  });

  it("returns the error on failure", async () => {
    (getPlans as any).mockRejectedValue(new Error("boom"));
    const { result } = renderHook(() => useGetPlans(), {
      wrapper: QueryClientProviderWrapper(),
    });
    await waitFor(() => expect(result.current.error).toBeTruthy());
    expect(result.current.plans).toBeUndefined();
  });
});
