import { render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import * as GoogleMaps from "@vis.gl/react-google-maps";
import PlaceSearchInput from "../../../src/ui/Form/PlaceSearchInput";
import * as GlobalContext from "../../../src/context/GlobalContext";
import useGetUserLimits from "../../../src/hooks/useGetUserLimits";
import { mockUseGlobalContextReturnObj } from "../../fixtures/context/globalContext";
import { planLimitsGarden } from "../../fixtures/plan/planlimits";

vi.mock("@vis.gl/react-google-maps");
vi.mock("../../../src/context/GlobalContext");
vi.mock("../../../src/hooks/useGetUserLimits");

const getPlacePredictions = vi.fn();
const onPlaceSelect = vi.fn();
const predictions = [
  { place_id: "p1", description: "Cafe One" },
  { place_id: "p2", description: "Cafe Two" },
];

class FakeAutocompleteService {
  getPlacePredictions = getPlacePredictions;
}

function setup(user: any = null) {
  vi.mocked(GlobalContext.useGlobalContext).mockImplementation(() => ({
    ...mockUseGlobalContextReturnObj,
    user,
  }));
  vi.mocked(useGetUserLimits).mockReturnValue({
    ...planLimitsGarden,
    distance: { limit: 2 },
  } as any);
  vi.mocked(GoogleMaps.useMapsLibrary).mockReturnValue({
    AutocompleteService: FakeAutocompleteService,
  } as any);
  render(<PlaceSearchInput onPlaceSelect={onPlaceSelect} />);
}

describe("PlaceSearchInput", () => {
  beforeEach(() => {
    (window as any).google = {
      maps: { places: { PlacesServiceStatus: { OK: "OK" } } },
    };
  });
  afterEach(() => vi.clearAllMocks());

  it("should render the search input with no results", () => {
    setup();
    expect(
      screen.getByPlaceholderText("Search boards in your local area..."),
    ).toBeInTheDocument();
    expect(screen.queryByTestId("place-search-results")).toBeNull();
  });

  it("should search within the user's area and list the predictions", async () => {
    getPlacePredictions.mockImplementation((_req, cb) => cb(predictions, "OK"));
    setup({ address: { geometry: { location: { lat: "10", lng: "20" } } } });
    await userEvent
      .setup()
      .type(screen.getByPlaceholderText(/Search boards/), "cafe");
    await waitFor(
      () => expect(screen.getByTestId("place-search-results")).toBeTruthy(),
      { timeout: 3000 },
    );
    expect(getPlacePredictions.mock.calls[0][0]).toMatchObject({
      input: "cafe",
      types: ["establishment"],
      locationRestriction: { north: 12, south: 8, east: 22, west: 18 },
    });
    expect(screen.getByText("Cafe One")).toBeInTheDocument();
  });

  it("should call onPlaceSelect with the clicked prediction", async () => {
    getPlacePredictions.mockImplementation((_req, cb) => cb(predictions, "OK"));
    setup();
    const user = userEvent.setup();
    await user.type(screen.getByPlaceholderText(/Search boards/), "cafe");
    await user.click(
      await screen.findByText("Cafe Two", {}, { timeout: 3000 }),
    );
    expect(onPlaceSelect).toHaveBeenCalledWith(predictions[1]);
  });

  it("should show no results when the service status is not OK", async () => {
    getPlacePredictions.mockImplementation((_req, cb) => cb(null, "ZERO"));
    setup();
    await userEvent
      .setup()
      .type(screen.getByPlaceholderText(/Search boards/), "zzz");
    await waitFor(() => expect(getPlacePredictions).toHaveBeenCalled(), {
      timeout: 3000,
    });
    expect(screen.queryByTestId("place-search-results")).toBeNull();
  });

  it("should not search when the places library is not loaded", async () => {
    vi.mocked(GlobalContext.useGlobalContext).mockImplementation(() => ({
      ...mockUseGlobalContextReturnObj,
    }));
    vi.mocked(useGetUserLimits).mockReturnValue(planLimitsGarden as any);
    vi.mocked(GoogleMaps.useMapsLibrary).mockReturnValue(null);
    render(<PlaceSearchInput onPlaceSelect={onPlaceSelect} />);
    await userEvent
      .setup()
      .type(screen.getByPlaceholderText(/Search boards/), "cafe");
    await new Promise((r) => setTimeout(r, 1000));
    expect(getPlacePredictions).not.toHaveBeenCalled();
  });
});
