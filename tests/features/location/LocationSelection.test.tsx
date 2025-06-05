import { fireEvent, render, screen } from "@testing-library/react";
import LocationSelection from "../../../src/features/location/LocationSelection";
import * as GlobalContext from "../../../src/context/GlobalContext";
import useGetPlacesByCoords from "../../../src/hooks/useGetPlacesByCoords";
import BoardListing from "../../../src/features/location/BoardListing";

// fixtures
import { responseData } from "../../fixtures/nearbyPlaces";
import { mockUseGlobalContextReturnObj } from "../../fixtures/globalContext";

// mocks
vi.mock("../../../src/features/location/BoardListing");
vi.mock("../../../src/context/GlobalContext");
vi.mock("../../../src/hooks/useGetPlacesByCoords");

describe("Location Selection", () => {
  const mockPlaces = responseData.places;

  const mockUseGetPlacesByCoordsReturnObj = {
    places: [],
    error: null,
    isGettingPlaces: false,
  };
  beforeEach(() => {
    vi.mocked(GlobalContext.useGlobalContext).mockImplementation(
      () => mockUseGlobalContextReturnObj
    );
    vi.mocked(useGetPlacesByCoords).mockImplementation(
      () => mockUseGetPlacesByCoordsReturnObj
    );
    vi.mocked(BoardListing).mockImplementation(() => {
      return <div data-testid="mock-board-listing">Mock BoardListing</div>;
    });
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should render Spinner", () => {
    // assemble
    vi.mocked(useGetPlacesByCoords).mockImplementation(() => ({
      ...mockUseGetPlacesByCoordsReturnObj,
      isGettingPlaces: true,
    }));

    // act
    render(<LocationSelection coords={{ latitude: 1, longitude: 1 }} />);

    // assert
    const spinner = screen.getByTestId("location-selection-spinner");
    expect(spinner).toBeTruthy();
  });

  it("should render LocationSelection with places", () => {
    // assemble
    vi.mocked(useGetPlacesByCoords).mockImplementation(() => ({
      ...mockUseGetPlacesByCoordsReturnObj,
      places: mockPlaces,
    }));
    // act
    render(<LocationSelection coords={{ latitude: 1, longitude: 1 }} />);
    // assert
    const boardListingComp = screen.getByTestId("mock-board-listing");
    expect(boardListingComp).toBeTruthy();
    expect(boardListingComp.textContent).toBe("Mock BoardListing");
  });

  it("should render LocationSelection with No places", () => {
    // assemble
    vi.mocked(useGetPlacesByCoords).mockImplementation(() => ({
      ...mockUseGetPlacesByCoordsReturnObj,
      places: [],
    }));
    // act
    render(<LocationSelection coords={{ latitude: 1, longitude: 1 }} />);
    // assert
    const boardListingComp = screen.queryByTestId("mock-board-listing");
    expect(boardListingComp).toBeNull();
    const noBoardsMessage = screen.getByTestId("no-boards-found-message");
    expect(noBoardsMessage).toBeTruthy();
  });
  it("should render LocationSelection with error", () => {
    // assemble
    vi.mocked(useGetPlacesByCoords).mockImplementation(() => ({
      ...mockUseGetPlacesByCoordsReturnObj,
      places: null,
      error: "Error fetching nearby places: HTTP error! Status: 500",
    }));
    // act
    render(<LocationSelection coords={{ latitude: 1, longitude: 1 }} />);
    // assert
    const boardListingComp = screen.queryByTestId("mock-board-listing");
    expect(boardListingComp).toBeNull();
    const errorMessage = screen.getByTestId("error-message");
    expect(errorMessage.textContent).toBe(
      "Error fetching nearby places: HTTP error! Status: 500"
    );
  });
  it("should render LocationSelection with No places and close", () => {
    // assemble
    vi.mocked(useGetPlacesByCoords).mockImplementation(() => ({
      ...mockUseGetPlacesByCoordsReturnObj,
      places: [],
    }));
    // act
    render(<LocationSelection coords={{ latitude: 1, longitude: 1 }} />);
    // assert
    const closeIcon = screen.getByTestId("location-selection-close-icon");
    expect(closeIcon).toBeTruthy();
    // act
    fireEvent.click(closeIcon);
    const noBoardsMessage = screen.getByTestId("no-boards-found-message");
    expect(noBoardsMessage).toBeTruthy();
  });
});
