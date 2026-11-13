import { render, screen, waitFor } from "@testing-library/react";
import Board from "../../../src/features/board/Board";
import * as routerDom from "react-router-dom";
// import { useQueryClient } from "@tanstack/react-query";
import * as ReactQuery from "@tanstack/react-query";
import * as GlobalContext from "../../../src/context/GlobalContext";
import useGetBoard from "../../../src/features/board/useGetBoard";
import { noBoardFoundForPlaceError } from "../../fixtures/supabase/board/errors";
import NoFlyers from "../../../src/features/board/NoFlyers";
import { dummyBoardData } from "../../fixtures/supabase/board/data";
import FlyerBlockInteractive from "../../../src/ui/Flyer/FlyerBlockInteractive";
import { QueryClientProviderWrapper } from "../../test-utils";
import { mockUseGlobalContextReturnObj } from "../../fixtures/context/globalContext";
import { userFromContext } from "../../fixtures/authentication/login";
import { userEvent } from "@testing-library/user-event";
import { logQrScan } from "../../../src/services/apiQrAnalytics";
import FlyerBlockInteractiveList from "../../../src/ui/Flyer/FlyerBlockInteractiveList";
import useGetUserLimits from "../../../src/hooks/useGetUserLimits";

// mocks
vi.mock("react-router-dom");
vi.mock("../../../src/features/board/useGetBoard");
vi.mock("../../../src/features/board/NoFlyers.tsx");
vi.mock("../../../src/ui/Flyer/FlyerBlockInteractive");
vi.mock("../../../src/context/GlobalContext");
vi.mock("../../../src/services/apiQrAnalytics");
vi.mock("../../../src/ui/Flyer/FlyerBlockInteractiveList");
vi.mock("../../../src/hooks/useGetUserLimits");
// vi.mock("@tanstack/react-query");
vi.mock("@tanstack/react-query", async () => {
  const actual = await vi.importActual("@tanstack/react-query");
  return {
    ...actual,
    useQueryClient: vi.fn(),
  };
});

describe("Board", () => {
  const useParamsSpy = vi.fn();
  beforeEach(() => {
    vi.mocked(routerDom.useParams).mockImplementation(useParamsSpy);
    vi.mocked(FlyerBlockInteractive).mockImplementation(() => {
      return <div data-testid="board-flyer-block">Flyer Block Interactive</div>;
    });
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should render Loading Spinner", () => {
    // assemble
    useParamsSpy.mockReturnValue({ id: null });
    vi.mocked(useGetBoard).mockImplementation(() => ({
      isLoadingBoard: true,
      board: { data: null, error: null },
    }));
    // act
    render(<Board />, { wrapper: QueryClientProviderWrapper() });
    const board = screen.getByTestId("overlay-spinner");
    // assert
    expect(board).toBeTruthy();
  });

  it("should show the NoFlyer component when there is no board found for the place", () => {
    // assemble
    useParamsSpy.mockReturnValue({ id: "1" });
    vi.mocked(useGetBoard).mockImplementation(() => ({
      isLoadingBoard: false,
      board: { data: null, error: noBoardFoundForPlaceError },
    }));
    vi.mocked(NoFlyers).mockImplementation(() => {
      return <div data-testid="no-flyers">No Flyers</div>;
    });
    // act
    render(<Board />, { wrapper: QueryClientProviderWrapper() });
    const noFlyers = screen.getByTestId("no-flyers");
    // assert
    expect(noFlyers).toBeTruthy();
  });

  it("should show the Board Container component when the board is found", () => {
    // assemble
    useParamsSpy.mockReturnValue({ id: "1" });
    vi.mocked(useGetBoard).mockImplementation(() => ({
      isLoadingBoard: false,
      board: dummyBoardData,
    }));
    // act
    render(<Board />, { wrapper: QueryClientProviderWrapper() });
    const board = screen.getByTestId("board-container");
    // assert
    expect(board).toBeTruthy();
    expect(screen.getAllByTestId("board-flyer-block")).toBeTruthy();
  });

  describe("checkIfUserHasFlyerHere", () => {
    const setHasFlyerAtLocationSpy = vi.fn();
    beforeEach(() => {
      vi.mocked(GlobalContext.useGlobalContext).mockImplementation(() => ({
        ...mockUseGlobalContextReturnObj,
        user: userFromContext,
        setHasFlyerAtLocation: setHasFlyerAtLocationSpy,
      }));
      // vi.mocked(ReactQuery.useQueryClient).mockImplementation(() => ({
      //   getQueryData: getQueryDataMock,
      // }))
    });
    afterEach(() => {
      vi.restoreAllMocks();
    });
    it("should trigger checkIfUserHasFlyerHere when user is signed in and user has flyer on board", async () => {
      // assemble
      useParamsSpy.mockReturnValue({ id: "1" });
      vi.mocked(useGetBoard).mockImplementation(() => ({
        isLoadingBoard: false,
        board: dummyBoardData,
      }));
      // vi.spyOn(ReactQuery, "useQueryClient").mockReturnValue(() => ({
      //   getQueryData: vi.fn().mockReturnValue(dummyBoardData),
      // }));
      const boardData = {
        data: { ...dummyBoardData.data, hasFlyerHere: true },
        error: null,
      };
      vi.mocked(ReactQuery.useQueryClient).mockReturnValue({
        getQueryData: vi.fn().mockReturnValue(boardData),
      });
      // act
      render(<Board />, { wrapper: QueryClientProviderWrapper() });
      const board = screen.getByTestId("board-container");
      // assert
      expect(board).toBeTruthy();
      await waitFor(() =>
        expect(setHasFlyerAtLocationSpy).toHaveBeenCalledWith(true)
      );
    });
    it("should trigger checkIfUserHasFlyerHere when user is signed in and user does not have flyer on board", async () => {
      // assemble
      useParamsSpy.mockReturnValue({ id: "1" });
      vi.mocked(useGetBoard).mockImplementation(() => ({
        isLoadingBoard: false,
        board: dummyBoardData,
      }));
      // vi.spyOn(ReactQuery, "useQueryClient").mockReturnValue(() => ({
      //   getQueryData: vi.fn().mockReturnValue(dummyBoardData),
      // }));
      const boardData = {
        data: { ...dummyBoardData.data, hasFlyerHere: false },
        error: null,
      };
      vi.mocked(ReactQuery.useQueryClient).mockReturnValue({
        getQueryData: vi.fn().mockReturnValue(boardData),
      });
      // act
      render(<Board />, { wrapper: QueryClientProviderWrapper() });
      const board = screen.getByTestId("board-container");
      // assert
      expect(board).toBeTruthy();
      await waitFor(() =>
        expect(setHasFlyerAtLocationSpy).toHaveBeenCalledWith(false)
      );
    });
  });
  describe("interactions", () => {
    const allowedLimits = {
      onLocationPosting: { isAllowed: true },
    } as ReturnType<typeof useGetUserLimits>;
    const setShowMerchantDisclaimerModalSpy = vi.fn();
    const setShowBoardWelcomeModalSpy = vi.fn();
    const setSelectedPlaceSpy = vi.fn();

    function mockContext(overrides = {}) {
      vi.mocked(GlobalContext.useGlobalContext).mockImplementation(() => ({
        ...mockUseGlobalContextReturnObj,
        setShowMerchantDisclaimerModal: setShowMerchantDisclaimerModalSpy,
        setShowBoardWelcomeModal: setShowBoardWelcomeModalSpy,
        setSelectedPlace: setSelectedPlaceSpy,
        ...overrides,
      }));
    }

    beforeEach(() => {
      useParamsSpy.mockReturnValue({ id: "1" });
      vi.mocked(useGetUserLimits).mockReturnValue(allowedLimits);
      vi.mocked(FlyerBlockInteractiveList).mockImplementation(() => (
        <div data-testid="board-flyer-list-item">List Item</div>
      ));
      vi.mocked(useGetBoard).mockImplementation(() => ({
        isLoadingBoard: false,
        board: dummyBoardData,
      }));
      vi.mocked(ReactQuery.useQueryClient).mockReturnValue({
        getQueryData: vi.fn().mockReturnValue(undefined),
      } as any);
      mockContext();
    });
    afterEach(() => {
      window.history.replaceState({}, "", "/");
      vi.clearAllMocks();
    });

    it("should open the merchant disclaimer modal from the info icon", async () => {
      const user = userEvent.setup();
      render(<Board />, { wrapper: QueryClientProviderWrapper() });
      await user.click(
        screen.getByTestId("board-container").querySelector(".info-icon")!,
      );
      expect(setShowMerchantDisclaimerModalSpy).toHaveBeenCalledWith(true);
    });

    it("should show the welcome modal only for anonymous users", () => {
      const { unmount } = render(<Board />, {
        wrapper: QueryClientProviderWrapper(),
      });
      expect(setShowBoardWelcomeModalSpy).toHaveBeenCalledWith(true);
      unmount();
      setShowBoardWelcomeModalSpy.mockClear();
      mockContext({ user: userFromContext });
      render(<Board />, { wrapper: QueryClientProviderWrapper() });
      expect(setShowBoardWelcomeModalSpy).toHaveBeenCalledWith(false);
      expect(setShowBoardWelcomeModalSpy).not.toHaveBeenCalledWith(true);
    });

    it("should switch between card and list view", async () => {
      const user = userEvent.setup();
      render(<Board />, { wrapper: QueryClientProviderWrapper() });
      expect(screen.getAllByTestId("board-flyer-block").length).toBeGreaterThan(
        0,
      );
      await user.click(screen.getByText("View"));
      expect(screen.queryAllByTestId("board-flyer-block").length).toBe(0);
      expect(
        screen.getAllByTestId("board-flyer-list-item").length,
      ).toBeGreaterThan(0);
      await user.click(screen.getByText("View"));
      expect(screen.getAllByTestId("board-flyer-block").length).toBeGreaterThan(
        0,
      );
    });

    it("should filter flyers by category and subcategory and show an empty message", async () => {
      const user = userEvent.setup();
      render(<Board />, { wrapper: QueryClientProviderWrapper() });
      expect(screen.queryByTestId("category-container")).toBeNull();
      await user.click(screen.getByText("Filter"));
      const category = await screen.findByTestId("category-container");
      const select = category.querySelector("select")!;
      // the fixture flyer is "Miscellaneous"
      await user.selectOptions(select, "Services");
      expect(await screen.findByText("No flyers found")).toBeTruthy();
      expect(screen.getByTestId("subcategory-container")).toBeTruthy();
      await user.selectOptions(select, "Miscellaneous");
      await waitFor(() =>
        expect(screen.queryByText("No flyers found")).toBeNull(),
      );
      const subSelect = screen
        .getByTestId("subcategory-container")
        .querySelector("select")!;
      await user.selectOptions(subSelect, subSelect.options[1].value);
      expect(await screen.findByText("No flyers found")).toBeTruthy();
      // turning the filter off clears it
      await user.click(screen.getByText("Filter"));
      await waitFor(() =>
        expect(screen.queryByText("No flyers found")).toBeNull(),
      );
    });

    it("should show the limit warning when on-location posting is not allowed", () => {
      vi.mocked(useGetUserLimits).mockReturnValue({
        onLocationPosting: { isAllowed: false },
      } as ReturnType<typeof useGetUserLimits>);
      render(<Board />, { wrapper: QueryClientProviderWrapper() });
      expect(screen.getByText(/reached your limit/i)).toBeTruthy();
    });

    it("should tell the user they already have a flyer here", () => {
      mockContext({ hasFlyerAtLocation: true });
      render(<Board />, { wrapper: QueryClientProviderWrapper() });
      expect(
        screen.getByText("You already have a flyer posted here"),
      ).toBeTruthy();
    });

    it("should not tell the board owner they already have a flyer here", () => {
      mockContext({
        hasFlyerAtLocation: true,
        user: {
          ...userFromContext,
          address: {
            ...userFromContext.address,
            formatted_address: dummyBoardData.data.formattedAddress,
          },
        },
      });
      render(<Board />, { wrapper: QueryClientProviderWrapper() });
      expect(
        screen.queryByText("You already have a flyer posted here"),
      ).toBeNull();
    });

    it("should mark the user as having a flyer here for an anonymous posting", async () => {
      const setHasFlyerAtLocationSpy = vi.fn();
      mockContext({
        anonUserPostings: ["1"],
        setHasFlyerAtLocation: setHasFlyerAtLocationSpy,
      });
      render(<Board />, { wrapper: QueryClientProviderWrapper() });
      await waitFor(() =>
        expect(setHasFlyerAtLocationSpy).toHaveBeenCalledWith(true),
      );
    });

    describe("qr scan logging", () => {
      const selectedPlace = { id: "1", displayName: { text: "Place" } };

      it("should log the scan when the ea param is truthy", () => {
        window.history.replaceState({}, "", "/?ea=true");
        mockContext({ selectedPlace });
        render(<Board />, { wrapper: QueryClientProviderWrapper() });
        expect(logQrScan).toHaveBeenCalledWith(selectedPlace);
      });

      it("should not log the scan when the ea param is missing", () => {
        mockContext({ selectedPlace });
        render(<Board />, { wrapper: QueryClientProviderWrapper() });
        expect(logQrScan).not.toHaveBeenCalled();
      });

      it("should not log the scan when the ea param is false", () => {
        window.history.replaceState({}, "", "/?ea=false");
        mockContext({ selectedPlace });
        render(<Board />, { wrapper: QueryClientProviderWrapper() });
        expect(logQrScan).not.toHaveBeenCalled();
      });
    });
  });
});
