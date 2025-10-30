import { render, screen, act, waitFor } from "@testing-library/react";
import MapContainer from "../../../src/features/map/MapContainer";
import { userEvent } from "@testing-library/user-event";
// import * as GoogleMaps from "@vis.gl/react-google-maps";

import * as GlobalContext from "../../../src/context/GlobalContext";
import { mockUseGlobalContextReturnObj } from "../../fixtures/context/globalContext";
import { QueryClientProviderWrapperWithBrowserRouterAndGoogle } from "../../test-utils";
import { userFromContext } from "../../fixtures/authentication/login";
import useGetUserLimits from "../../../src/hooks/useGetUserLimits";
import { planLimitsGarden } from "../../fixtures/plan/planlimits";
import { placeSearchInputPredictions } from "../../fixtures/map/placeSearchInput";

const user = userEvent.setup();

// mocks
vi.mock("../../../src/context/GlobalContext");
vi.mock("../../../src/hooks/useGetUserLimits");
// vi.mock("@vis.gl/react-google-maps");

describe("MapContainer", () => {
  let mockGetPlacePredictions = vi.fn();
  beforeEach(() => {
    vi.mocked(GlobalContext.useGlobalContext).mockImplementation(() => ({
      ...mockUseGlobalContextReturnObj,
      user: userFromContext,
    }));
    vi.mocked(useGetUserLimits).mockImplementation(() => planLimitsGarden);
    // vi.mocked(GoogleMaps.useMapsLibrary).mockImplementation(() => ({
    //   AutocompleteService: vi.fn().mockImplementation(() => ({
    //     getPlacePredictions: mockGetPlacePredictions,
    //   })),
    // }));
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should render", async () => {
    render(<MapContainer />, {
      wrapper: QueryClientProviderWrapperWithBrowserRouterAndGoogle(),
    });

    await waitFor(() => {
      expect(screen.getByTestId("map-container")).toBeDefined();
    });

    let results;
    let placeSearchContainer;
    let placeSearchInput;
    await waitFor(() => {
      placeSearchContainer = screen.getByTestId("place-search-container");
      placeSearchInput = placeSearchContainer.querySelector("input");
      expect(placeSearchInput).toBeDefined();
    });

    act(async () => {
      await user.type(placeSearchInput, "hudson");
    });

    await waitFor(() => {
      expect(placeSearchInput.value).toBe("hudson");
      console.log("placeSearchInput.value", placeSearchInput.value);
    });
    // TODO: add a fake timer for 8 seconds because of the debounce
    await waitFor(() => {
      expect(screen.getByTestId("place-search-results")).toBeIntheDocument();
      // screen.debug(undefined, Infinity);
    });

    // results = screen.getByTestId("place-search-container").querySelector("ul");
    // act(() => {
    //   const firstResult = results.querySelector("li");
    //   console.log("firstResult", firstResult);
    //   user.click(firstResult);
    // });
    // call callback function for getPlacePredictions
    // await mockGetPlacePredictions.mock.calls[0][1](placeSearchInputPredictions);
  });
});
