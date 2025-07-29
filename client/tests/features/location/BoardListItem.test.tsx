import { fireEvent, render, screen } from "@testing-library/react";
import * as routerDom from "react-router-dom";

import BoardListItem from "../../../src/features/location/BoardListItem";
import * as GlobalContext from "../../../src/context/GlobalContext";

// fixtures
import { responseData } from "../../fixtures/nearbyPlaces";
import { mockUseGlobalContextReturnObj } from "../../fixtures/globalContext";

// mocks
vi.mock("react-router-dom");
vi.mock("../../../src/context/GlobalContext");

describe("BoardListItem", () => {
  const mockPlace = responseData.places[0];
  const setSelectedPlaceSpy = vi.fn();
  const navigateSpy = vi.fn();

  beforeEach(() => {
    vi.mocked(routerDom.useNavigate).mockImplementation(() => navigateSpy);
    vi.mocked(GlobalContext.useGlobalContext).mockImplementation(() => ({
      ...mockUseGlobalContextReturnObj,
      setSelectedPlace: setSelectedPlaceSpy,
    }));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should render BoardListItem", () => {
    // assemble

    // act
    render(<BoardListItem place={mockPlace} />);

    // assert
    const boardListItemComp = screen.getByTestId("board-list-item");
    expect(boardListItemComp).toBeTruthy();

    // assert
    const address = screen.getByTestId("board-list-item-address");
    expect(address.textContent).toBe(mockPlace.formattedAddress);

    // act
    const button = screen.getByRole("button");
    expect(button).toBeTruthy();
    fireEvent.click(button);

    // assert
    expect(setSelectedPlaceSpy).toHaveBeenCalledWith(mockPlace);
    expect(navigateSpy).toHaveBeenCalledWith(
      `/dashboard/board/${mockPlace.id}`
    );
  });
});
