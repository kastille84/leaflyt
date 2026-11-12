import { renderHook } from "@testing-library/react";
import { useLikeFlyers } from "../../src/hooks/useLikeFlyers";
import { useGlobalContext } from "../../src/context/GlobalContext";

vi.mock("../../src/context/GlobalContext", () => ({
  useGlobalContext: vi.fn(),
}));

describe("useLikeFlyers", () => {
  const setLikedContextSessionFlyers = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
    (useGlobalContext as any).mockReturnValue({
      likedContextSessionFlyers: [],
      setLikedContextSessionFlyers,
    });
  });

  it("adds a flyer to an empty session list", () => {
    const { result } = renderHook(() => useLikeFlyers("f1"));
    result.current.setLikedFlyer("add");
    expect(JSON.parse(sessionStorage.getItem("likedFlyers")!)).toEqual(["f1"]);
    expect(setLikedContextSessionFlyers).toHaveBeenCalledWith(["f1"]);
  });

  it("appends to an existing session list", () => {
    sessionStorage.setItem("likedFlyers", JSON.stringify(["f0"]));
    const { result } = renderHook(() => useLikeFlyers("f1"));
    result.current.setLikedFlyer("add");
    expect(setLikedContextSessionFlyers).toHaveBeenCalledWith(["f0", "f1"]);
  });

  it("removes a flyer from the session list", () => {
    sessionStorage.setItem("likedFlyers", JSON.stringify(["f0", "f1"]));
    const { result } = renderHook(() => useLikeFlyers("f1"));
    result.current.setLikedFlyer("remove");
    expect(JSON.parse(sessionStorage.getItem("likedFlyers")!)).toEqual(["f0"]);
    expect(setLikedContextSessionFlyers).toHaveBeenCalledWith(["f0"]);
  });
});
