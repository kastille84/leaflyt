import { renderHook, waitFor } from "@testing-library/react";
import * as routerDom from "react-router-dom";
import useGetBoard from "../../../src/features/board/useGetBoard";
import * as apiBoards from "../../../src/services/apiBoards";
import { dummyBoardData } from "../../fixtures/supabase/board/data";
import { QueryClientProviderWrapper } from "../../test-utils";

// mocks
// for useParams
vi.mock("react-router-dom");
// for getBoard
vi.mock("../../../src/services/apiBoards");

describe("useGetBoard", () => {
  const useParamsSpy = vi.fn();
  const mockGetBoardFn = vi.fn();
  beforeEach(() => {
    vi.mocked(routerDom.useParams).mockImplementation(useParamsSpy);
    vi.mocked(apiBoards.getBoard).mockImplementation(mockGetBoardFn);
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should be defined", async () => {
    debugger;
    // assemble
    useParamsSpy.mockReturnValue({ id: "1" });
    mockGetBoardFn.mockReturnValue(dummyBoardData);
    // act
    const { result } = renderHook(() => useGetBoard(), {
      wrapper: QueryClientProviderWrapper(),
    });

    // assert
    await waitFor(() => expect(result.current.board).toEqual(dummyBoardData));
  });
});
