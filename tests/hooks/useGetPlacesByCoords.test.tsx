import { renderHook, waitFor } from "@testing-library/react";
import useGetPlacesByCoords from "../../src/hooks/useGetPlacesByCoords";
import { responseData } from "../fixtures/nearbyPlaces";

describe("useGetPlacesByCoords", () => {
  beforeEach(() => {});
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should be defined", () => {
    const { result } = renderHook(() =>
      useGetPlacesByCoords({ latitude: 47, longitude: 74 })
    );
    expect(result.current).toBeDefined();
  });

  it("should return a list of places based on coords", async () => {
    // assemble
    vi.stubGlobal("fetch", async (url, options) => {
      return {
        ok: true,
        status: 200,
        json: async () => responseData,
      };
    });
    // act
    const { result } = renderHook(() =>
      useGetPlacesByCoords({ latitude: 47, longitude: 74 })
    );

    // assert
    await waitFor(() => {
      expect(result.current.places).toEqual(responseData.places);
    });
  });
});
