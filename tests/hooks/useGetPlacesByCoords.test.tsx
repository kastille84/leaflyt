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
    vi.stubGlobal("fetch", async () => {
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

  it("should return an empty list of places if no places are found", async () => {
    // assemble
    vi.stubGlobal("fetch", async () => {
      return {
        ok: true,
        status: 200,
        json: async () => ({
          places: [],
        }),
      };
    });
    // act
    const { result } = renderHook(() =>
      useGetPlacesByCoords({ latitude: 47, longitude: 74 })
    );
    // assert
    await waitFor(() => {
      expect(result.current.isGettingPlaces).toBe(true);
    });
    expect(result.current.places).toEqual([]);
  });

  it("should return an error is status is NOT OK", async () => {
    debugger;
    // assemble
    vi.stubGlobal("fetch", async () => {
      return {
        ok: false,
        status: 500,
        json: async () => ({
          places: [],
        }),
      };
    });
    // act
    const { result } = renderHook(() =>
      useGetPlacesByCoords({ latitude: 47, longitude: 74 })
    );
    // assert
    await waitFor(() => {
      expect(result.current.isGettingPlaces).toBe(true);
    });
    await waitFor(() => {
      expect(result.current.error).toBe(null);
    });
    await waitFor(() => {
      expect(result.current.error).toEqual(
        "Error fetching nearby places: HTTP error! Status: 500"
      );
    });
  });
});
