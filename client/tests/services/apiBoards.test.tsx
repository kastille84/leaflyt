import { getBoards, getBoard, createBoard } from "../../src/services/apiBoards";
import { supabase } from "../../src/services/supabase";
import { queueFrom } from "./supabaseMock";

vi.mock("../../src/services/supabase", () => ({
  supabase: { from: vi.fn(), rpc: vi.fn() },
}));

const from = supabase.from as any;

describe("apiBoards", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("getBoards selects all boards", async () => {
    const [query] = queueFrom(from, { data: [{ id: 1 }], error: null });
    const result = await getBoards();
    expect(from).toHaveBeenCalledWith("boards");
    expect(query.select).toHaveBeenCalledWith("*");
    expect(result).toEqual({ data: [{ id: 1 }], error: null });
  });

  describe("getBoard", () => {
    it("returns the board with hasFlyerHere false without a profile id", async () => {
      const [query] = queueFrom(from, {
        data: { id: 1, placeId: "p1" },
        error: null,
      });
      const result = await getBoard("p1");
      expect(from).toHaveBeenCalledTimes(1);
      expect(query.eq).toHaveBeenCalledWith("placeId", "p1");
      expect(result).toEqual({
        data: { id: 1, placeId: "p1", hasFlyerHere: false },
        error: null,
      });
    });

    it("flags hasFlyerHere when the user already has a flyer there", async () => {
      const [flyerQuery] = queueFrom(
        from,
        { data: { id: 9 }, error: null },
        { data: { id: 1 }, error: null },
      );
      const result = await getBoard("p1", 5);
      expect(from).toHaveBeenNthCalledWith(1, "flyers");
      expect(flyerQuery.eq).toHaveBeenCalledWith("place", "p1");
      expect(flyerQuery.eq).toHaveBeenCalledWith("user", 5);
      expect(result.data).toEqual({ id: 1, hasFlyerHere: true });
    });

    it("returns an empty object and the error when no board is found", async () => {
      const error = { message: "not found" };
      queueFrom(from, { data: null, error });
      const result = await getBoard("p1");
      expect(result).toEqual({ data: {}, error });
    });
  });

  it("createBoard inserts and returns the board", async () => {
    const board: any = { placeId: "p1", name: "Board" };
    const [query] = queueFrom(from, { data: { id: 1, ...board }, error: null });
    const result = await createBoard(board);
    expect(query.insert).toHaveBeenCalledWith([board]);
    expect(result).toEqual({ data: { id: 1, ...board }, error: null });
  });
});
