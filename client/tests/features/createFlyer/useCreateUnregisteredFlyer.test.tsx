import { act, renderHook, waitFor } from "@testing-library/react";
import useCreateUnregisteredFlyer from "../../../src/features/createFlyer/useCreateUnregisteredFlyer";
import * as GlobalContext from "../../../src/context/GlobalContext";
import * as apiFlyers from "../../../src/services/apiFlyers";
import { QueryClientProviderWrapper } from "../../test-utils";
import { mockUseGlobalContextReturnObj } from "../../fixtures/context/globalContext";
import { responseData } from "../../fixtures/nearbyPlaces";

vi.mock("../../../src/context/GlobalContext");
vi.mock("../../../src/services/apiFlyers");

const selectedPlace = responseData.places[0];

function setup() {
  return renderHook(() => useCreateUnregisteredFlyer(), {
    wrapper: QueryClientProviderWrapper(),
  });
}

describe("useCreateUnregisteredFlyer", () => {
  beforeEach(() => {
    vi.mocked(GlobalContext.useGlobalContext).mockImplementation(() => ({
      ...mockUseGlobalContextReturnObj,
      selectedPlace,
    }));
  });
  afterEach(() => {
    vi.resetAllMocks();
  });

  it("should create a flyer with the selected place", async () => {
    vi.mocked(apiFlyers.createUnregisteredFlyer).mockResolvedValue({} as any);
    const { result } = setup();
    const prepData = { title: "x" } as any;
    act(() => result.current.createFlyer(prepData));
    await waitFor(() =>
      expect(apiFlyers.createUnregisteredFlyer).toHaveBeenCalledWith(
        prepData,
        selectedPlace,
      ),
    );
  });

  it("should expose the create error", async () => {
    vi.mocked(apiFlyers.createUnregisteredFlyer).mockRejectedValue(
      new Error("create failed"),
    );
    const { result } = setup();
    act(() => result.current.createFlyer({} as any));
    await waitFor(() =>
      expect(result.current.createFlyerError?.message).toBe("create failed"),
    );
  });

  it("should like a flyer", async () => {
    vi.mocked(apiFlyers.likeFlyer).mockResolvedValue({} as any);
    const { result } = setup();
    const flyer = { id: "f1" } as any;
    act(() => result.current.likeFlyerFn({ flyer, type: "inc" }));
    await waitFor(() =>
      expect(apiFlyers.likeFlyer).toHaveBeenCalledWith(flyer, "inc"),
    );
  });

  it("should expose the like error", async () => {
    vi.mocked(apiFlyers.likeFlyer).mockRejectedValue(new Error("like failed"));
    const { result } = setup();
    act(() => result.current.likeFlyerFn({ flyer: {} as any, type: "dec" }));
    await waitFor(() =>
      expect(result.current.likeFlyerFnError?.message).toBe("like failed"),
    );
  });

  it("should flag a flyer", async () => {
    vi.mocked(apiFlyers.flagFlyer).mockResolvedValue({} as any);
    const { result } = setup();
    const flyer = { id: "f1" } as any;
    act(() =>
      result.current.flagFlyerFn({
        flyer,
        reason: "spam",
        userId: null,
        placeName: "Cafe",
      }),
    );
    await waitFor(() =>
      expect(apiFlyers.flagFlyer).toHaveBeenCalledWith({
        flyer,
        reason: "spam",
        placeName: "Cafe",
        userId: null,
      }),
    );
  });

  it("should expose the flag error", async () => {
    vi.mocked(apiFlyers.flagFlyer).mockRejectedValue(new Error("flag failed"));
    const { result } = setup();
    act(() =>
      result.current.flagFlyerFn({
        flyer: {} as any,
        reason: "spam",
        userId: "u1",
        placeName: "Cafe",
      }),
    );
    await waitFor(() =>
      expect(result.current.flagFlyerFnError?.message).toBe("flag failed"),
    );
  });
});
