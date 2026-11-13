import { render, screen, waitFor } from "@testing-library/react";
import { QueryClientProviderWrapperWithBrowserRouter } from "../../test-utils";
import { userEvent } from "@testing-library/user-event";

import NoFlyers from "../../../src/features/board/NoFlyers";

import * as GlobalContext from "../../../src/context/GlobalContext";

// fixtures
import { mockUseGlobalContextReturnObj } from "../../fixtures/context/globalContext";
import { act } from "react";
import useGetUserLimits from "../../../src/hooks/useGetUserLimits";
import { userFromContext } from "../../fixtures/authentication/login";

// mocks
vi.mock("../../../src/context/GlobalContext");
vi.mock("../../../src/hooks/useGetUserLimits");

const user = userEvent.setup();

describe("NoFlyers", () => {
  const setIsOpenFlyerDrawerMockFn = vi.fn();
  const setDrawerActionMockFn = vi.fn();
  const setSelectedPlaceMockFn = vi.fn();
  const setShowBoardWelcomeModalMockFn = vi.fn();
  function mockLimits(onLocation: boolean, remote: boolean) {
    vi.mocked(useGetUserLimits).mockReturnValue({
      onLocationPosting: { isAllowed: onLocation },
      remotePosting: { isAllowed: remote },
    } as ReturnType<typeof useGetUserLimits>);
  }
  function mockContext(overrides = {}) {
    vi.mocked(GlobalContext.useGlobalContext).mockImplementation(() => ({
      ...mockUseGlobalContextReturnObj,
      setSelectedPlace: setSelectedPlaceMockFn,
      setShowBoardWelcomeModal: setShowBoardWelcomeModalMockFn,
      ...overrides,
    }));
  }
  beforeEach(() => {
    // RTL's cleanup unmounts after each test, which can call these spies
    setSelectedPlaceMockFn.mockClear();
    setShowBoardWelcomeModalMockFn.mockClear();
    mockLimits(true, true);
    vi.mocked(GlobalContext.useGlobalContext).mockImplementation(() => ({
      ...mockUseGlobalContextReturnObj,
      // setIsOpenFlyerDrawer, setDrawerAction --> spy on these
      setIsOpenFlyerDrawer: setIsOpenFlyerDrawerMockFn,
      setDrawerAction: setDrawerActionMockFn,
    }));
  });
  afterEach(() => {
    vi.restoreAllMocks();
    window.history.replaceState({}, "", "/");
  });

  it("should render NoFlyers", async () => {
    render(<NoFlyers />, {
      wrapper: QueryClientProviderWrapperWithBrowserRouter(),
    });
    const noFlyers = screen.getByTestId("no-flyers-container");
    expect(noFlyers).toBeTruthy();
    const button = screen.getByRole("button", { name: "Create Flyer" });
    await act(async () => {
      await user.click(button);
    });
    await waitFor(() => {
      expect(setIsOpenFlyerDrawerMockFn).toHaveBeenCalledWith(true);
      expect(setDrawerActionMockFn).toHaveBeenCalledWith("create");
    });
  });
  describe("posting limits", () => {
    beforeEach(() => {
      mockContext();
    });

    it("should not warn when on-location posting is allowed", () => {
      render(<NoFlyers />, {
        wrapper: QueryClientProviderWrapperWithBrowserRouter(),
      });
      expect(screen.queryByText(/reached your limit/i)).toBeNull();
      expect(
        (screen.getByRole("button", { name: "Create Flyer" }) as HTMLButtonElement)
          .disabled,
      ).toBe(false);
    });

    it("should warn and disable posting when on-location posting is exhausted", () => {
      mockLimits(false, true);
      render(<NoFlyers />, {
        wrapper: QueryClientProviderWrapperWithBrowserRouter(),
      });
      expect(screen.getByText(/reached your limit/i)).toBeTruthy();
      expect(
        (screen.getByRole("button", { name: "Create Flyer" }) as HTMLButtonElement)
          .disabled,
      ).toBe(true);
    });

    it("should use the remote limit when the pt param is r", () => {
      window.history.replaceState({}, "", "/?pt=r");
      mockLimits(true, false);
      render(<NoFlyers />, {
        wrapper: QueryClientProviderWrapperWithBrowserRouter(),
      });
      expect(screen.getByText(/limit for posting flyers remotely/i)).toBeTruthy();
      expect(
        (screen.getByRole("button", { name: "Create Flyer" }) as HTMLButtonElement)
          .disabled,
      ).toBe(true);
    });

    it("should clear the selected place on unmount when posting is not allowed", () => {
      mockLimits(false, true);
      const { unmount } = render(<NoFlyers />, {
        wrapper: QueryClientProviderWrapperWithBrowserRouter(),
      });
      expect(setSelectedPlaceMockFn).not.toHaveBeenCalled();
      unmount();
      expect(setSelectedPlaceMockFn).toHaveBeenCalledWith(null);
    });

    it("should keep the selected place on unmount when posting is allowed", () => {
      const { unmount } = render(<NoFlyers />, {
        wrapper: QueryClientProviderWrapperWithBrowserRouter(),
      });
      unmount();
      expect(setSelectedPlaceMockFn).not.toHaveBeenCalled();
    });
  });

  describe("welcome modal", () => {
    it("should open for anonymous users", () => {
      mockContext({ user: null });
      render(<NoFlyers />, {
        wrapper: QueryClientProviderWrapperWithBrowserRouter(),
      });
      expect(setShowBoardWelcomeModalMockFn).toHaveBeenCalledWith(true);
    });

    it("should close for logged in users", () => {
      mockContext({ user: userFromContext });
      render(<NoFlyers />, {
        wrapper: QueryClientProviderWrapperWithBrowserRouter(),
      });
      expect(setShowBoardWelcomeModalMockFn).toHaveBeenCalledWith(false);
      expect(setShowBoardWelcomeModalMockFn).not.toHaveBeenCalledWith(true);
    });
  });
});
