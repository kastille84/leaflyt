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

  // it("should render", async () => {
  //   let results;
  //   let placeSearchContainer: any;
  //   let placeSearchInput: any;

  //   render(<MapContainer />, {
  //     wrapper: QueryClientProviderWrapperWithBrowserRouterAndGoogle(),
  //   });

  //   await waitFor(() => {
  //     expect(screen.getByTestId("map-container")).toBeDefined();
  //   });

  //   await waitFor(() => {
  //     placeSearchContainer = screen.getByTestId("place-search-container");
  //     expect(placeSearchContainer).toBeDefined();
  //   });

  //   await waitFor(() => {
  //     placeSearchInput = placeSearchContainer.querySelector("input");
  //     expect(placeSearchInput).toBeDefined();
  //   });

  //   act(async () => {
  //     await user.type(placeSearchInput, "hudson");
  //   });
  //   // TODO: add a fake timer for 8 seconds because of the debounce
  //   // vi.advanceTimersByTime(800);

  //   await waitFor(() => {
  //     expect(placeSearchInput.value).toBe("hudson");
  //     console.log("placeSearchInput.value", placeSearchInput.value);
  //   });

  //   await waitFor(
  //     () => {
  //       expect(screen.findByTestId("place-search-results")).toBeIntheDocument();
  //       // screen.debug(undefined, Infinity);
  //     },
  //     {
  //       timeout: 1000,
  //     }
  //   );

  //   // results = screen.getByTestId("place-search-container").querySelector("ul");
  //   // act(() => {
  //   //   const firstResult = results.querySelector("li");
  //   //   console.log("firstResult", firstResult);
  //   //   user.click(firstResult);
  //   // });
  //   // call callback function for getPlacePredictions
  //   // await mockGetPlacePredictions.mock.calls[0][1](placeSearchInputPredictions);
  // });

  it("should render type in the placeSearchInput and get the results", async () => {
    render(<MapContainer />, {
      wrapper: QueryClientProviderWrapperWithBrowserRouterAndGoogle(),
    });
    await waitFor(async () => {
      expect(await screen.findByTestId("map-container")).toBeInTheDocument();
    });

    await waitFor(
      async () => {
        expect(
          await screen.findByTestId("place-search-container")
        ).toBeInTheDocument();
      },
      {
        timeout: 5000,
      }
    );

    const placeSearchContainer = screen.getByTestId("place-search-container");
    const placeSearchInput = placeSearchContainer.querySelector("input");
    await user.type(placeSearchInput!, "hudson");
    await waitFor(() => {
      screen.debug(undefined, Infinity);
      expect(placeSearchInput!.value).toBe("hudson");
    });

    // await waitFor(
    //   async () => {
    //     expect(
    //       await screen.findByTestId("place-search-results")
    //     ).toBeInTheDocument();
    //   },
    //   {
    //     timeout: 5000,
    //   }
    // );

    // const results = screen
    //   .getByTestId("place-search-container")
    //   .querySelector("ul");
    // const firstResult = results.querySelector("li");
    // await user.click(firstResult);
  });
});
