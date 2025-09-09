import { render, screen, fireEvent } from "@testing-library/react";
import * as routerDom from "react-router-dom";

import Landing from "../../src/pages/Landing";
import * as GlobalContext from "../../src/context/GlobalContext";

// fixtures
import { mockUseGlobalContextReturnObj } from "../fixtures/context/globalContext";
import { QueryClientProviderWrapper } from "../test-utils";

// mocks
vi.mock("react-router-dom");
vi.mock("../../src/context/GlobalContext");

describe("Landing Page", () => {
  let mockGetUserGeo = vi.fn();
  const navigateSpy = vi.fn();

  beforeEach(() => {
    vi.mocked(routerDom.useNavigate).mockImplementation(() => navigateSpy);

    vi.mocked(GlobalContext.useGlobalContext).mockImplementation(() => {
      return { ...mockUseGlobalContextReturnObj, getUserGeo: mockGetUserGeo };
    });
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should render Landing Page", () => {
    render(<Landing />, { wrapper: QueryClientProviderWrapper() });

    const h1 = screen.getByRole("heading", { level: 1 });
    expect(h1.textContent).toBe(
      "Making Community Boards Fun, Interactive & Useful Again"
    );

    const h2 = screen.getByRole("heading", { level: 2 });
    expect(h2.textContent).toBe(
      "Spread Your Message. See What Others are Discussing & Doing in Your Local Digital Community Board"
    );

    const button = screen.getByRole("button", {
      name: "Search For a Board Near You",
    });
    expect(button.textContent).toBe("Search For a Board Near You");
  });

  it("should call getUserGeo when button is clicked", () => {
    render(<Landing />, { wrapper: QueryClientProviderWrapper() });
    const button = screen.getByRole("button", {
      name: "Search For a Board Near You",
    });
    fireEvent.click(button);
    // await waitFor(() => expect(mockGetUserGeo).toHaveBeenCalledTimes(1));
    expect(mockGetUserGeo).toHaveBeenCalled();
  });

  it("should show OverlaySpinner when getting location", () => {
    vi.mocked(GlobalContext.useGlobalContext).mockImplementation(() => ({
      ...mockUseGlobalContextReturnObj,
      isGettingLocation: true,
    }));
    render(<Landing />, { wrapper: QueryClientProviderWrapper() });
    const overlayMessage = screen.getByText(
      "Getting Your Location based on your device's GPS, mobile or wifi signal"
    );
    expect(overlayMessage).toBeTruthy();
  });

  it("should show LocationSearch component when coords is avaiable", () => {
    vi.mocked(GlobalContext.useGlobalContext).mockImplementation(() => ({
      ...mockUseGlobalContextReturnObj,
      coords: {
        latitude: 45,
        longitude: 34,
      },
    }));
    render(<Landing />, { wrapper: QueryClientProviderWrapper() });
    const locationSelectionSpinner = screen.getByTestId("overlay-spinner");
    expect(locationSelectionSpinner).toBeTruthy();
  });
});
