import { render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import toast from "react-hot-toast";
import SavedFlyersList from "../../../src/features/saved_flyers/SavedFlyersList";
import * as GlobalContext from "../../../src/context/GlobalContext";
import useRegisteredFlyer from "../../../src/features/createFlyer/useRegisteredFlyer";
import { useResponsiveWidth } from "../../../src/hooks/useResponsiveWidth";
import { mockUseGlobalContextReturnObj } from "../../fixtures/context/globalContext";

vi.mock("../../../src/context/GlobalContext");
vi.mock("../../../src/features/createFlyer/useRegisteredFlyer");
vi.mock("../../../src/hooks/useResponsiveWidth");
vi.mock("react-hot-toast", () => ({
  default: { success: vi.fn(), error: vi.fn() },
}));
vi.mock("../../../src/ui/Flyer/FlyerBlockStatic", () => ({
  default: ({ flyer, handleRedeem }: any) => (
    <div data-testid={`flyer-${flyer.id}`}>
      {flyer.title}
      <button onClick={handleRedeem}>redeem-{flyer.id}</button>
    </div>
  ),
}));

const user = userEvent.setup();
const setUser = vi.fn();
const removeSavedFlyerFn = vi.fn();

const savedFlyers = [
  {
    id: 11,
    flyer: {
      id: "f1",
      title: "Pizza deal",
      category: "Services",
      subcategory: "Professional Services",
      place: { name: "Joe's" },
    },
  },
  {
    id: 12,
    flyer: {
      id: "f2",
      title: "Used bike",
      category: "Goods for Sale/Wanted",
      subcategory: "For Sale",
      place: { name: "Park" },
    },
  },
] as any[];

function mockUser(userValue: any) {
  vi.mocked(GlobalContext.useGlobalContext).mockImplementation(() => ({
    ...mockUseGlobalContextReturnObj,
    user: userValue,
    setUser,
  }));
}

describe("SavedFlyersList", () => {
  beforeEach(() => {
    mockUser({ saved_flyers: savedFlyers });
    vi.mocked(useResponsiveWidth).mockReturnValue("s_desktop" as any);
    vi.mocked(useRegisteredFlyer).mockReturnValue({
      removeSavedFlyerFn,
    } as any);
  });
  afterEach(() => {
    vi.resetAllMocks();
  });

  it("should say there are no saved flyers when the user has none", () => {
    mockUser({ saved_flyers: [] });
    render(<SavedFlyersList />);
    expect(screen.getByText("No saved flyers")).toBeInTheDocument();
    expect(screen.queryByTestId("saved-flyers")).not.toBeInTheDocument();
  });

  it("should say there are no saved flyers without a user", () => {
    mockUser(null);
    render(<SavedFlyersList />);
    expect(screen.getByText("No saved flyers")).toBeInTheDocument();
  });

  it("should list saved flyers with the place they were saved at", () => {
    render(<SavedFlyersList />);
    expect(screen.getByTestId("saved-flyers")).toBeInTheDocument();
    expect(screen.getByTestId("flyer-f1")).toBeInTheDocument();
    expect(screen.getByTestId("flyer-f2")).toBeInTheDocument();
    expect(screen.getByText("Saved @ Joe's")).toBeInTheDocument();
    expect(screen.getByText("Saved @ Park")).toBeInTheDocument();
  });

  it("should lay out items centered on small screens", () => {
    vi.mocked(useResponsiveWidth).mockReturnValue("s_mobile" as any);
    render(<SavedFlyersList />);
    expect(screen.getByTestId("flyer-f1")).toBeInTheDocument();
  });

  describe("filtering", () => {
    async function turnOnFilter() {
      await user.click(screen.getByLabelText("Filter:"));
    }

    it("should only show the category select once the filter is on", async () => {
      render(<SavedFlyersList />);
      expect(screen.queryByTestId("category-container")).not.toBeInTheDocument();
      await turnOnFilter();
      expect(screen.getByTestId("category-container")).toBeInTheDocument();
      expect(
        screen.queryByTestId("subcategory-container"),
      ).not.toBeInTheDocument();
    });

    it("should filter by category and show the subcategory select", async () => {
      render(<SavedFlyersList />);
      await turnOnFilter();
      await user.selectOptions(
        screen
          .getByTestId("category-container")
          .querySelector("select") as HTMLSelectElement,
        "Services",
      );
      expect(screen.getByTestId("flyer-f1")).toBeInTheDocument();
      expect(screen.queryByTestId("flyer-f2")).not.toBeInTheDocument();
      expect(screen.getByTestId("subcategory-container")).toBeInTheDocument();
    });

    it("should filter by subcategory", async () => {
      render(<SavedFlyersList />);
      await turnOnFilter();
      await user.selectOptions(
        screen
          .getByTestId("category-container")
          .querySelector("select") as HTMLSelectElement,
        "Services",
      );
      await user.selectOptions(
        screen
          .getByTestId("subcategory-container")
          .querySelector("select") as HTMLSelectElement,
        "Professional Services",
      );
      expect(screen.getByTestId("flyer-f1")).toBeInTheDocument();
      expect(screen.queryByTestId("flyer-f2")).not.toBeInTheDocument();
    });

    it("should say no flyers found when nothing matches", async () => {
      mockUser({ saved_flyers: [savedFlyers[1]] });
      render(<SavedFlyersList />);
      await turnOnFilter();
      await user.selectOptions(
        screen
          .getByTestId("category-container")
          .querySelector("select") as HTMLSelectElement,
        "Services",
      );
      expect(screen.getByText("No flyers found")).toBeInTheDocument();
    });

    it("should clear the filter and show everything when turned off", async () => {
      render(<SavedFlyersList />);
      await turnOnFilter();
      await user.selectOptions(
        screen
          .getByTestId("category-container")
          .querySelector("select") as HTMLSelectElement,
        "Services",
      );
      await turnOnFilter();
      expect(screen.queryByTestId("category-container")).not.toBeInTheDocument();
      expect(screen.getByTestId("flyer-f1")).toBeInTheDocument();
      expect(screen.getByTestId("flyer-f2")).toBeInTheDocument();
    });
  });

  describe("removing a saved flyer", () => {
    it("should remove with the unsave icon, update the user and toast", async () => {
      removeSavedFlyerFn.mockImplementation((_args, { onSuccess }) =>
        onSuccess({ user: { saved_flyers: [] } }),
      );
      const { container } = render(<SavedFlyersList />);
      await user.click(container.querySelectorAll("svg")[0]);

      expect(removeSavedFlyerFn).toHaveBeenCalledWith(
        { flyerId: 11, type: "id" },
        expect.any(Object),
      );
      expect(setUser).toHaveBeenCalledWith({ saved_flyers: [] });
      expect(toast.success).toHaveBeenCalledWith(
        "Flyer removed from saved flyers",
      );
      expect(screen.queryByText("Removing flyer...")).not.toBeInTheDocument();
    });

    it("should remove when the flyer is redeemed", async () => {
      removeSavedFlyerFn.mockImplementation((_args, { onSuccess }) =>
        onSuccess({ user: { saved_flyers: [] } }),
      );
      render(<SavedFlyersList />);
      await user.click(screen.getByText("redeem-f2"));
      expect(removeSavedFlyerFn).toHaveBeenCalledWith(
        { flyerId: 12, type: "id" },
        expect.any(Object),
      );
      expect(toast.success).toHaveBeenCalledWith("Flyer redeemed!");
    });

    it("should show a spinner while removing", async () => {
      removeSavedFlyerFn.mockImplementation(() => {});
      render(<SavedFlyersList />);
      await user.click(screen.getByText("redeem-f1"));
      expect(screen.getByText("Removing flyer...")).toBeInTheDocument();
    });

    it("should toast the error and hide the spinner on failure", async () => {
      removeSavedFlyerFn.mockImplementation((_args, { onError }) =>
        onError(new Error("remove failed")),
      );
      render(<SavedFlyersList />);
      await user.click(screen.getByText("redeem-f1"));
      expect(toast.error).toHaveBeenCalledWith("remove failed");
      await waitFor(() =>
        expect(screen.queryByText("Removing flyer...")).not.toBeInTheDocument(),
      );
      expect(setUser).not.toHaveBeenCalled();
    });
  });
});
