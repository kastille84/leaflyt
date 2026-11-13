import { render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import toast from "react-hot-toast";

import MapContainer from "../../../src/features/map/MapContainer";
import * as GlobalContext from "../../../src/context/GlobalContext";
import useGetUserLimits from "../../../src/hooks/useGetUserLimits";
import { useResponsiveWidth } from "../../../src/hooks/useResponsiveWidth";
import { getPlaceDetails } from "../../../src/services/googleMaps";
import { QueryClientProviderWrapperWithBrowserRouter } from "../../test-utils";

// fixtures
import { mockUseGlobalContextReturnObj } from "../../fixtures/context/globalContext";
import { userFromContext } from "../../fixtures/authentication/login";
import { planLimitsGarden } from "../../fixtures/plan/planlimits";

// mocks
const mockNavigate = vi.fn();
const mapProps = vi.fn();

vi.mock("../../../src/context/GlobalContext");
vi.mock("../../../src/hooks/useGetUserLimits");
vi.mock("../../../src/hooks/useResponsiveWidth");
vi.mock("../../../src/services/googleMaps");
vi.mock("react-hot-toast");
vi.mock("react-router-dom", async () => ({
  ...(await vi.importActual("react-router-dom")),
  useNavigate: () => mockNavigate,
}));
vi.mock("@vis.gl/react-google-maps", async () => ({
  ...(await vi.importActual("@vis.gl/react-google-maps")),
  Map: (props: any) => {
    mapProps(props);
    return <div data-testid="map">{props.children}</div>;
  },
  AdvancedMarker: ({ children }: any) => (
    <div data-testid="home-marker">{children}</div>
  ),
  Pin: () => <div data-testid="pin" />,
}));
vi.mock("../../../src/features/map/MyRectangle", () => ({
  default: ({ bounds }: any) => (
    <div data-testid="rectangle">{JSON.stringify(bounds)}</div>
  ),
}));
vi.mock("../../../src/features/map/MarkerWithInfoWindow", () => ({
  default: ({ position }: any) => (
    <div data-testid="flyer-marker">{JSON.stringify(position)}</div>
  ),
}));
vi.mock("../../../src/ui/Form/PlaceSearchInput", () => ({
  default: ({ onPlaceSelect }: any) => (
    <button
      data-testid="select-place"
      onClick={() => onPlaceSelect({ place_id: "place-1" })}
    >
      select place
    </button>
  ),
}));

const setSelectedPlaceSpy = vi.fn();

function mockPlanDistance(limit: number | null) {
  vi.mocked(useGetUserLimits).mockReturnValue({
    ...planLimitsGarden,
    distance: { limit },
  } as ReturnType<typeof useGetUserLimits>);
}

function mockUser(user: any = userFromContext) {
  vi.mocked(GlobalContext.useGlobalContext).mockImplementation(() => ({
    ...mockUseGlobalContextReturnObj,
    user,
    setSelectedPlace: setSelectedPlaceSpy,
  }));
}

function renderMap() {
  return render(<MapContainer />, {
    wrapper: QueryClientProviderWrapperWithBrowserRouter(),
  });
}

describe("MapContainer behavior", () => {
  beforeEach(() => {
    mockUser();
    mockPlanDistance(0.05);
    vi.mocked(useResponsiveWidth).mockReturnValue("l_desktop");
  });
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should center the map and the rectangle on the user's address", () => {
    renderMap();
    const lat = Number(userFromContext.address.geometry.location.lat);
    const lng = Number(userFromContext.address.geometry.location.lng);
    expect(mapProps.mock.calls[0][0].defaultCenter).toEqual({ lat, lng });
    expect(JSON.parse(screen.getByTestId("rectangle").textContent!)).toEqual({
      north: lat + 0.05,
      south: lat - 0.05,
      east: lng + 0.05,
      west: lng - 0.05,
    });
  });

  it("should fall back to 0,0 and no flyer markers without a user", () => {
    mockUser(null);
    renderMap();
    expect(mapProps.mock.calls[0][0].defaultCenter).toEqual({
      lat: 0,
      lng: 0,
    });
    expect(screen.queryAllByTestId("flyer-marker")).toHaveLength(0);
  });

  it("should render a marker for each of the user's flyers", () => {
    mockUser({
      ...userFromContext,
      flyers: [
        { id: 1, place: { latlng: { latitude: "10", longitude: "20" } } },
        { id: 2, place: undefined },
      ],
    });
    renderMap();
    const markers = screen.getAllByTestId("flyer-marker");
    expect(markers).toHaveLength(2);
    expect(JSON.parse(markers[0].textContent!)).toEqual({ lat: 10, lng: 20 });
    expect(JSON.parse(markers[1].textContent!)).toEqual({ lat: 0, lng: 0 });
  });

  describe("default zoom", () => {
    it.each([
      [0.05, "l_desktop", 12],
      [0.05, "s_tablet", 11],
      [0.1, "l_desktop", 11],
      [0.1, "m_tablet", 10],
      [0.25, "l_desktop", 10],
      [0.25, "s_mobile", 9],
      [null, "l_desktop", 12],
    ])("limit %s on %s should zoom to %s", (limit, width, zoom) => {
      mockPlanDistance(limit);
      vi.mocked(useResponsiveWidth).mockReturnValue(width);
      renderMap();
      expect(mapProps.mock.calls[0][0].defaultZoom).toBe(zoom);
    });
  });

  describe("selecting a place", () => {
    it("should get the place details, store the place and navigate to its board", async () => {
      const user = userEvent.setup();
      vi.mocked(getPlaceDetails).mockResolvedValue({ id: "abc" } as any);
      renderMap();
      await user.click(screen.getByTestId("select-place"));
      await waitFor(() =>
        expect(mockNavigate).toHaveBeenCalledWith(
          "/dashboard/board/abc?&pt=r",
        ),
      );
      expect(getPlaceDetails).toHaveBeenCalledWith("place-1");
      expect(setSelectedPlaceSpy).toHaveBeenCalledWith({ id: "abc" });
      expect(screen.queryByTestId("overlay-spinner")).toBeNull();
    });

    it("should show the spinner while the place loads", async () => {
      const user = userEvent.setup();
      vi.mocked(getPlaceDetails).mockReturnValue(new Promise(() => {}));
      renderMap();
      await user.click(screen.getByTestId("select-place"));
      expect(await screen.findByTestId("overlay-spinner")).toBeTruthy();
    });

    it("should toast the error and not navigate when the lookup fails", async () => {
      const user = userEvent.setup();
      vi.mocked(getPlaceDetails).mockRejectedValue(new Error("no place"));
      renderMap();
      await user.click(screen.getByTestId("select-place"));
      await waitFor(() => expect(toast.error).toHaveBeenCalledWith("no place"));
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });
});
