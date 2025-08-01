import { render, screen } from "@testing-library/react";
import Board from "../../../src/features/board/Board";
import * as routerDom from "react-router-dom";
import useGetBoard from "../../../src/features/board/useGetBoard";
import { noBoardFoundForPlaceError } from "../../fixtures/supabase/board/errors";
import NoFlyers from "../../../src/features/board/NoFlyers";
import { dummyBoardData } from "../../fixtures/supabase/board/data";
import BoardFlyerBlock from "../../../src/ui/Flyer/BoardFlyerBlock";

// mocks
vi.mock("react-router-dom");
vi.mock("../../../src/features/board/useGetBoard");
vi.mock("../../../src/features/board/NoFlyers.tsx");
vi.mock("../../../src/ui/Flyer/BoardFlyerBlock");

describe("Board", () => {
  const useParamsSpy = vi.fn();
  beforeEach(() => {
    vi.mocked(routerDom.useParams).mockImplementation(useParamsSpy);
    vi.mocked(BoardFlyerBlock).mockImplementation(() => {
      return <div data-testid="board-flyer-block">Board Flyer Block</div>;
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
    render(<Board />);
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
    render(<Board />);
    const noFlyers = screen.getByTestId("no-flyers");
    // assert
    expect(noFlyers).toBeTruthy();
  });

  it.only("should show the Board Container component when the board is found", () => {
    // assemble
    useParamsSpy.mockReturnValue({ id: "1" });
    vi.mocked(useGetBoard).mockImplementation(() => ({
      isLoadingBoard: false,
      board: dummyBoardData,
    }));
    // act
    render(<Board />);
    const board = screen.getByTestId("board-container");
    // assert
    expect(board).toBeTruthy();
    expect(screen.getAllByTestId("board-flyer-block")).toBeTruthy();
  });
});
