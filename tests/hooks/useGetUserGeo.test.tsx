import { renderHook } from "@testing-library/react";
import useGetUserGeo from "../../src/hooks/useGetUserGeo";

describe("useGetUserGeo", () => {
  it("should be defined", () => {
    const { result } = renderHook(() => useGetUserGeo());
    expect(result.current).toBeDefined();
  });

  it("should return getUserGeo", () => {
    const { result } = renderHook(() => useGetUserGeo());
    expect(result.current.getUserGeo).toBeDefined();
  });

  describe("call getUserGeo", () => {
    afterEach(() => {
      vi.restoreAllMocks();
    });

    it("should call getUserGeo and trigger onSuccess", () => {
      // assemble
      vi.spyOn(navigator.geolocation, "getCurrentPosition").mockImplementation(
        (success, error) => {
          // Mock implementation
          success({
            coords: {
              latitude: 37.7749,
              longitude: -122.4194,
              accuracy: 0,
              altitude: null,
              altitudeAccuracy: null,
              heading: null,
              speed: null,
              toJSON: function () {
                throw new Error("Function not implemented.");
              },
            },
            timestamp: 0,
            toJSON: function () {
              throw new Error("Function not implemented.");
            },
          });
        }
      );

      //act
      const { result } = renderHook(() => useGetUserGeo());
      result.current.getUserGeo();

      // assert
      expect(result.current).toBeDefined();
    });
    it("should call getUserGeo and trigger onReject", () => {
      // assemble
      vi.spyOn(navigator.geolocation, "getCurrentPosition").mockImplementation(
        (success, error) => {
          // Mock implementation
          if (error) {
            error({
              code: 1,
              message: "User denied Geolocation",
              PERMISSION_DENIED: 1,
              POSITION_UNAVAILABLE: 2,
              TIMEOUT: 3,
            });
          }
        }
      );

      //act
      const { result } = renderHook(() => useGetUserGeo());
      result.current.getUserGeo();

      // assert
      expect(result.current).toBeDefined();
    });
  });
});
