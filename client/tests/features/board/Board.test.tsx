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
import { mockUseGlobalContextReturnObj } from "../../fixtures/globalContext";
import { userFromContext } from "../../fixtures/authentication/login";

// mocks
vi.mock("react-router-dom");
vi.mock("../../../src/features/board/useGetBoard");
vi.mock("../../../src/features/board/NoFlyers.tsx");
vi.mock("../../../src/ui/Flyer/FlyerBlockInteractive");
vi.mock("../../../src/context/GlobalContext");
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
});
