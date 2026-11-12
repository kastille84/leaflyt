import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import ActionMenu from "../../src/ui/ActionMenu";
import ActionMenuMobile from "../../src/ui/ActionMenuMobile";
import { useGlobalContext } from "../../src/context/GlobalContext";
import useGetUserLimits from "../../src/hooks/useGetUserLimits";
import { supabase } from "../../src/services/supabase";
import { mockUseGlobalContextReturnObj } from "../fixtures/context/globalContext";

const navigate = vi.fn();
vi.mock("react-router-dom", async (importOriginal) => ({
  ...(await importOriginal<typeof import("react-router-dom")>()),
  useNavigate: () => navigate,
}));
vi.mock("../../src/context/GlobalContext", () => ({
  useGlobalContext: vi.fn(),
}));
vi.mock("../../src/hooks/useGetUserLimits", () => ({ default: vi.fn() }));
vi.mock("../../src/services/supabase", () => ({
  supabase: { auth: { signOut: vi.fn() } },
}));
vi.mock("../../src/features/location/LocationSelection", () => ({
  default: () => <div data-testid="location-selection" />,
}));
vi.mock("../../src/ui/Flyer/CreateFlyerButton", () => ({
  default: ({ disabled }: { disabled: boolean }) => (
    <button data-testid="create-flyer" disabled={disabled} />
  ),
}));
vi.mock("../../src/ui/OverlaySpinner", () => ({
  default: ({ message }: { message: string }) => (
    <div data-testid="overlay-spinner">{message}</div>
  ),
}));

const place = {
  id: "p1",
  displayName: { text: "Cafe" },
  formattedAddress: "1 Main St",
};

let ctx: any;
function setup(
  Component: React.ComponentType,
  overrides: any = {},
  limits: any = {},
  route = "/",
) {
  ctx = {
    ...mockUseGlobalContextReturnObj,
    setSelectedPlace: vi.fn(),
    setShowLoginModal: vi.fn(),
    setIsOpenBottomSlideIn: vi.fn(),
    setBottomSlideInType: vi.fn(),
    setUser: vi.fn(),
    getUserGeo: vi.fn(),
    setCoords: vi.fn(),
    setIsSelectingNewPlace: vi.fn(),
    setShowMerchantDisclaimerModal: vi.fn(),
    ...overrides,
  };
  (useGlobalContext as any).mockReturnValue(ctx);
  (useGetUserLimits as any).mockReturnValue({
    remotePosting: { isAllowed: true },
    onLocationPosting: { isAllowed: true },
    ...limits,
  });
  return render(
    <MemoryRouter initialEntries={[route]}>
      <Component />
    </MemoryRouter>,
  );
}

const createFlyerDisabled = () =>
  (screen.getByTestId("create-flyer") as HTMLButtonElement).disabled;

describe.each([
  ["ActionMenu", ActionMenu],
  ["ActionMenuMobile", ActionMenuMobile],
])("%s", (_name, Component) => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
  });

  describe("auth actions", () => {
    it("should show Sign Up and Login for anonymous users", async () => {
      setup(Component);
      const user = userEvent.setup();
      await user.click(screen.getByText("Sign Up"));
      expect(ctx.setIsOpenBottomSlideIn).toHaveBeenCalledWith(true);
      expect(ctx.setBottomSlideInType).toHaveBeenCalledWith("signup");
      await user.click(screen.getByText("Login"));
      expect(ctx.setShowLoginModal).toHaveBeenCalledWith(true);
    });

    it("should show the name initial and log out a user", async () => {
      (supabase.auth.signOut as any).mockResolvedValue({});
      setup(Component, { user: { name: "Acme", address: {} } });
      expect(screen.getByText("A")).toBeDefined();
      expect(screen.queryByText("Sign Up")).toBeNull();

      await userEvent.setup().click(screen.getByText("Logout"));
      expect(supabase.auth.signOut).toHaveBeenCalled();
      expect(ctx.setUser).toHaveBeenCalledWith(null);
      expect(ctx.setSelectedPlace).toHaveBeenCalledWith(null);
      expect(ctx.setCoords).toHaveBeenCalledWith(null);
      expect(navigate).toHaveBeenCalledWith("/");
    });

    it("should use the first name initial when there is no name", () => {
      setup(Component, { user: { firstName: "Bob", address: {} } });
      expect(screen.getByText("B")).toBeDefined();
    });
  });

  describe("find boards", () => {
    it("should start selecting a new place and get the location", async () => {
      setup(Component);
      await userEvent.setup().click(screen.getByText(/Find Boards/));
      expect(ctx.setIsSelectingNewPlace).toHaveBeenCalledWith(true);
      expect(ctx.getUserGeo).toHaveBeenCalled();
    });
  });

  describe("selected place", () => {
    it("should show the place details and open the disclaimer modal", async () => {
      const { container } = setup(Component, { selectedPlace: place });
      expect(screen.getByText("Cafe")).toBeDefined();
      expect(screen.getByText("1 Main St")).toBeDefined();
      await userEvent.setup().click(container.querySelector("svg")!);
      expect(ctx.setShowMerchantDisclaimerModal).toHaveBeenCalledWith(true);
    });

    it("should not show place details without a selected place", () => {
      setup(Component);
      expect(screen.queryByText("1 Main St")).toBeNull();
    });
  });

  describe("create flyer button", () => {
    it("should hide when there is no place", () => {
      setup(Component);
      expect(screen.queryByTestId("create-flyer")).toBeNull();
    });

    it("should hide when the place has a flyer and the user is not the owner", () => {
      setup(Component, { selectedPlace: place, hasFlyerAtLocation: true });
      expect(screen.queryByTestId("create-flyer")).toBeNull();
    });

    it("should be enabled when on-location posting is allowed", () => {
      setup(Component, { selectedPlace: place });
      expect(createFlyerDisabled()).toBe(false);
    });

    it("should be disabled when on-location posting is not allowed", () => {
      setup(
        Component,
        { selectedPlace: place },
        { onLocationPosting: { isAllowed: false } },
      );
      expect(createFlyerDisabled()).toBe(true);
    });

    it("should check remote posting when pt=r", () => {
      setup(
        Component,
        { selectedPlace: place },
        { remotePosting: { isAllowed: false } },
        "/?pt=r",
      );
      expect(createFlyerDisabled()).toBe(true);
    });

    it("should show for the board owner even when a flyer exists", () => {
      setup(Component, {
        selectedPlace: place,
        hasFlyerAtLocation: true,
        user: { name: "Owner", address: { formatted_address: "1 Main St" } },
      });
      expect(screen.getByTestId("create-flyer")).toBeDefined();
    });
  });

  describe("location loading and selection", () => {
    it("should show the spinner while getting location without a place", () => {
      setup(Component, { isGettingLocation: true });
      expect(screen.getByTestId("overlay-spinner")).toBeDefined();
    });

    it("should not show the spinner when a place is selected", () => {
      setup(Component, { isGettingLocation: true, selectedPlace: place });
      expect(screen.queryByTestId("overlay-spinner")).toBeNull();
    });

    it("should show location selection when coords exist and no place", () => {
      setup(Component, { coords: { lat: 1, lng: 2 } });
      expect(screen.getByTestId("location-selection")).toBeDefined();
    });

    it("should show location selection when selecting a new place", () => {
      setup(Component, {
        coords: { lat: 1, lng: 2 },
        selectedPlace: place,
        isSelectingNewPlace: true,
      });
      expect(screen.getByTestId("location-selection")).toBeDefined();
    });

    it("should hide location selection without coords", () => {
      setup(Component);
      expect(screen.queryByTestId("location-selection")).toBeNull();
    });
  });
});
