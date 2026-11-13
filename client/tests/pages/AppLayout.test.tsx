import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import AppLayout from "../../src/pages/AppLayout";
import * as GlobalContext from "../../src/context/GlobalContext";
import { mockUseGlobalContextReturnObj } from "../fixtures/context/globalContext";

vi.mock("../../src/context/GlobalContext");
vi.mock("../../src/ui/LandingNav", () => ({
  default: () => <div data-testid="mock-landing-nav" />,
}));
vi.mock("../../src/ui/Footer", () => ({
  default: () => <div data-testid="mock-footer" />,
}));
vi.mock("../../src/ui/OverlaySpinner", () => ({
  default: ({ message }: { message: string }) => (
    <div data-testid="mock-spinner">{message}</div>
  ),
}));
vi.mock("../../src/features/location/LocationSelection", () => ({
  default: () => <div data-testid="mock-location-selection" />,
}));

function renderLayout() {
  return render(
    <MemoryRouter initialEntries={["/"]}>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<div data-testid="child">child</div>} />
        </Route>
      </Routes>
    </MemoryRouter>,
  );
}

describe("AppLayout", () => {
  beforeEach(() => {
    vi.mocked(GlobalContext.useGlobalContext).mockReturnValue(
      mockUseGlobalContextReturnObj,
    );
  });

  it("renders nav, outlet and footer only by default", () => {
    renderLayout();
    expect(screen.getByTestId("mock-landing-nav")).toBeTruthy();
    expect(screen.getByTestId("child")).toBeTruthy();
    expect(screen.getByTestId("mock-footer")).toBeTruthy();
    expect(screen.queryByTestId("mock-spinner")).toBeNull();
    expect(screen.queryByTestId("mock-location-selection")).toBeNull();
  });

  it("shows the spinner while getting the location", () => {
    vi.mocked(GlobalContext.useGlobalContext).mockReturnValue({
      ...mockUseGlobalContextReturnObj,
      isGettingLocation: true,
    });
    renderLayout();
    expect(screen.getByTestId("mock-spinner").textContent).toContain(
      "Getting Your Location",
    );
  });

  it("shows location selection when coords exist", () => {
    vi.mocked(GlobalContext.useGlobalContext).mockReturnValue({
      ...mockUseGlobalContextReturnObj,
      coords: { latitude: 1, longitude: 2 },
    } as any);
    renderLayout();
    expect(screen.getByTestId("mock-location-selection")).toBeTruthy();
  });
});
