import { renderHook } from "@testing-library/react";
import useGetUserGeo from "../../src/hooks/useGetUserGeo";
import toast from "react-hot-toast";

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
      vi.spyOn(navigator.geolocation, "watchPosition").mockImplementation(
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
          return 777;
        }
      );

      //act
      const { result } = renderHook(() => useGetUserGeo());
      result.current.getUserGeo();

      // assert
      expect(result.current).toBeDefined();
    });

    describe("Error states", () => {
      beforeEach(() => {
        vi.spyOn(toast, "error");
      });
      it("should call getUserGeo and trigger onReject: PERMISSION_DENIED", () => {
        // assemble
        vi.spyOn(navigator.geolocation, "watchPosition").mockImplementation(
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
            return 777;
          }
        );

        //act
        const { result } = renderHook(() => useGetUserGeo());
        result.current.getUserGeo();

        // assert
        expect(result.current).toBeDefined();
        // grab toast
        expect(toast.error).toHaveBeenCalledWith(
          "We weren't able to get your location. Make sure to select 'Allow' on the pop-up to enable location sharing."
        );
      });
      it("should call getUserGeo and trigger onReject: POSITION_UNAVAILABLE", () => {
        // assemble
        vi.spyOn(navigator.geolocation, "watchPosition").mockImplementation(
          (success, error) => {
            // Mock implementation
            if (error) {
              error({
                code: 2,
                message: "User denied Geolocation",
                PERMISSION_DENIED: 1,
                POSITION_UNAVAILABLE: 2,
                TIMEOUT: 3,
              });
            }
            return 777;
          }
        );

        //act
        const { result } = renderHook(() => useGetUserGeo());
        result.current.getUserGeo();

        // assert
        expect(result.current).toBeDefined();
        expect(toast.error).toHaveBeenCalledWith(
          "We weren't able to get your location. It seems to be unavailable. Please check your internet connection or move to another location."
        );
      });
      it("should call getUserGeo and trigger onReject: TIMEOUT", () => {
        // assemble
        vi.spyOn(navigator.geolocation, "watchPosition").mockImplementation(
          (success, error) => {
            // Mock implementation
            if (error) {
              error({
                code: 3,
                message: "User denied Geolocation",
                PERMISSION_DENIED: 1,
                POSITION_UNAVAILABLE: 2,
                TIMEOUT: 3,
              });
            }
            return 777;
          }
        );

        //act
        const { result } = renderHook(() => useGetUserGeo());
        result.current.getUserGeo();

        // assert
        expect(result.current).toBeDefined();
        expect(toast.error).toHaveBeenCalledWith(
          "We weren't able to get your location. The request timed out. Please check your internet connection or move to another location."
        );
      });
    });
  });
});
