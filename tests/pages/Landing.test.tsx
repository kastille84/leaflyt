import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import Landing from "../../src/pages/Landing";
import * as GlobalContext from "../../src/context/GlobalContext";

// fixtures
import { mockUseGlobalContextReturnObj } from "../fixtures/globalContext";
import { get } from "react-hook-form";

describe("Landing Page", () => {
  let mockGetUserGeo = vi.fn();

  vi.mock("../../src/context/GlobalContext");

  beforeEach(() => {
    vi.mocked(GlobalContext.useGlobalContext).mockImplementation(() => {
      return { ...mockUseGlobalContextReturnObj, getUserGeo: mockGetUserGeo };
    });
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should render Landing Page", () => {
    render(<Landing />);

    const h1 = screen.getByRole("heading", { level: 1 });
    expect(h1.textContent).toBe(
      "Making Community Boards Fun, Interactive & Useful Again"
    );

    const h2 = screen.getByRole("heading", { level: 2 });
    expect(h2.textContent).toBe(
      "Spread your Message. See what others are Discussing & Doing in your Local Digital Community Board"
    );

    const button = screen.getByRole("button");
    expect(button.textContent).toBe("Open Board Near You");
  });

  it("should call getUserGeo when button is clicked", () => {
    render(<Landing />);
    const button = screen.getByRole("button");
    fireEvent.click(button);
    // await waitFor(() => expect(mockGetUserGeo).toHaveBeenCalledTimes(1));
    expect(mockGetUserGeo).toHaveBeenCalled();
  });

  it("should show OverlaySpinner when getting location", () => {
    vi.mocked(GlobalContext.useGlobalContext).mockImplementation(() => ({
      ...mockUseGlobalContextReturnObj,
      isGettingLocation: true,
    }));
    render(<Landing />);
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
    render(<Landing />);
    const locationSelectionSpinner = screen.getByTestId("overlay-spinner");
    expect(locationSelectionSpinner).toBeTruthy();
  });
});
