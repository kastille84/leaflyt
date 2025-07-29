import { render, screen } from "@testing-library/react";
import BoardListing from "../../../src/features/location/BoardListing";
import BoardListItem from "../../../src/features/location/BoardListItem";
import { responseData } from "../../fixtures/nearbyPlaces";

// mocks
vi.mock("../../../src/features/location/BoardListItem");

describe("BoardListing", () => {
  const mockPlaces = responseData.places;

  beforeEach(() => {
    vi.mocked(BoardListItem).mockImplementation(() => {
      return <div data-testid="mock-board-listing">Mock BoardList Item</div>;
    });
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should render BoardListing", () => {
    render(<BoardListing places={[]} />);
    const boardListingComp = screen.getByTestId("board-listing-container");
    expect(boardListingComp).toBeTruthy();
  });

  it("should render BoardListing with places", () => {
    render(<BoardListing places={mockPlaces} />);
    const boardListingComp = screen.getByTestId("board-listing-container");
    expect(boardListingComp).toBeTruthy();
    expect(boardListingComp.textContent).toContain("Mock BoardList Item");
  });
});
