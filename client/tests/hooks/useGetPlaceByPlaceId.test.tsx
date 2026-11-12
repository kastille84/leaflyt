import { renderHook, waitFor } from "@testing-library/react";
import useGetPlaceByPlaceId from "../../src/hooks/useGetPlaceByPlaceId";
import { useGlobalContext } from "../../src/context/GlobalContext";
import { getPlaceDetails } from "../../src/services/googleMaps";

vi.mock("../../src/context/GlobalContext", () => ({
  useGlobalContext: vi.fn(),
}));
vi.mock("../../src/services/googleMaps", () => ({
  getPlaceDetails: vi.fn(),
}));

describe("useGetPlaceByPlaceId", () => {
  const setSelectedPlace = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useGlobalContext as any).mockReturnValue({ setSelectedPlace });
  });

  it("does nothing when disabled", () => {
    const { result } = renderHook(() => useGetPlaceByPlaceId("p1", false));
    expect(getPlaceDetails).not.toHaveBeenCalled();
    expect(result.current.isGettingPlace).toBe(true);
  });

  it("fetches the place and updates context", async () => {
    const place = [{ id: "p1" }];
    (getPlaceDetails as any).mockResolvedValue(place);
    const { result } = renderHook(() => useGetPlaceByPlaceId("p1", true));
    await waitFor(() => expect(result.current.isGettingPlace).toBe(false));
    expect(getPlaceDetails).toHaveBeenCalledWith("p1");
    expect(result.current.place).toEqual(place);
    expect(result.current.error).toBeNull();
    expect(setSelectedPlace).toHaveBeenCalledWith(place);
  });

  it("exposes the error message on failure", async () => {
    (getPlaceDetails as any).mockRejectedValue(new Error("nope"));
    const { result } = renderHook(() => useGetPlaceByPlaceId("p1", true));
    await waitFor(() => expect(result.current.isGettingPlace).toBe(false));
    expect(result.current.error).toBe("nope");
    expect(setSelectedPlace).not.toHaveBeenCalled();
  });
});
