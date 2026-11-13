import {
  groupFlyersToTemplates,
  checkIfCurrentFlyerIsSaved,
  checkIfCurrentFlyerIsLiked,
  groupFlyersBasedOnPostingMethod,
  totalNumberOfFlyerLikes,
  prepFlyerDataForAppropriateness,
  makeTopFlyer,
  isBoardOwner,
} from "../../src/utils/FlyerUtils";

describe("FlyerUtils", () => {
  it("groupFlyersToTemplates groups flyers by template", () => {
    const user: any = {
      flyers: [
        { id: 1, template: "a" },
        { id: 2, template: "b" },
        { id: 3, template: "a" },
      ],
    };
    const result = groupFlyersToTemplates(user);
    expect(result.a.map((f: any) => f.id)).toEqual([1, 3]);
    expect(result.b).toHaveLength(1);
  });

  it("groupFlyersToTemplates returns empty object for null user", () => {
    expect(groupFlyersToTemplates(null)).toEqual({});
  });

  it("checkIfCurrentFlyerIsSaved detects saved flyers", () => {
    const saved: any = [{ flyer: { id: 1 } }, { flyer: { id: 2 } }];
    expect(checkIfCurrentFlyerIsSaved(saved, { id: 2 } as any)).toBe(true);
    expect(checkIfCurrentFlyerIsSaved(saved, { id: 3 } as any)).toBe(false);
  });

  it("checkIfCurrentFlyerIsLiked detects liked flyers", () => {
    expect(checkIfCurrentFlyerIsLiked(["1", "2"], "2")).toBe(true);
    expect(checkIfCurrentFlyerIsLiked(["1", "2"], "3")).toBe(false);
  });

  it("groupFlyersBasedOnPostingMethod groups by postingMethod", () => {
    const flyers: any = [
      { id: 1, postingMethod: "map" },
      { id: 2, postingMethod: "board" },
      { id: 3, postingMethod: "map" },
    ];
    const result = groupFlyersBasedOnPostingMethod(flyers);
    expect(result.map).toHaveLength(2);
    expect(result.board).toHaveLength(1);
  });

  it("totalNumberOfFlyerLikes sums likes", () => {
    expect(totalNumberOfFlyerLikes([{ likes: 2 }, { likes: 3 }] as any)).toBe(
      5,
    );
    expect(totalNumberOfFlyerLikes([])).toBe(0);
  });

  describe("prepFlyerDataForAppropriateness", () => {
    it("builds message and only includes image urls", () => {
      const result = prepFlyerDataForAppropriateness({
        title: "T",
        content: "C",
        callToAction: { headline: "H", instructions: "I" },
        fileUrlArr: [
          { resource_type: "image", url: "img.png" },
          { resource_type: "video", url: "vid.mp4" },
        ],
      } as any);
      expect(result.messageToCheck).toBe("\nT\nC\nH\nI");
      expect(result.fileUrlsToCheck).toEqual([
        { image_url: { url: "img.png" }, type: "image_url" },
      ]);
    });

    it("handles missing call to action and files", () => {
      const result = prepFlyerDataForAppropriateness({
        title: "T",
        content: "C",
      } as any);
      expect(result.messageToCheck).toBe("\nT\nC");
      expect(result.fileUrlsToCheck).toEqual([]);
    });
  });

  describe("makeTopFlyer", () => {
    const mk = (id: number, email?: string, address?: string): any => ({
      id,
      user: { email, address: { formatted_address: address } },
    });

    it("returns input when empty or not an array", () => {
      expect(makeTopFlyer([], "leaflit")).toEqual([]);
      expect(makeTopFlyer(null as any, "leaflit")).toBeNull();
    });

    it("moves leaflit flyers to the front in place", () => {
      const flyers = [mk(1, "a@a.com"), mk(2, "support@leaflit.us")];
      const result = makeTopFlyer(flyers, "leaflit");
      expect(result).toBe(flyers);
      expect(flyers.map((f: any) => f.id)).toEqual([2, 1]);
    });

    it("moves establishment flyers matching the board address first", () => {
      const flyers = [mk(1, "a", "x"), mk(2, "b", "board")];
      makeTopFlyer(flyers, "establishment", "board");
      expect(flyers.map((f: any) => f.id)).toEqual([2, 1]);
    });

    it("leaves order when nothing matches", () => {
      const flyers = [mk(1, "a", "x"), mk(2, "b", "y")];
      makeTopFlyer(flyers, "establishment");
      expect(flyers.map((f: any) => f.id)).toEqual([1, 2]);
    });
  });

  describe("isBoardOwner", () => {
    const user: any = { address: { formatted_address: "123 Main" } };

    it("is false when user or board is missing", () => {
      expect(isBoardOwner(null, {} as any)).toBe(false);
      expect(isBoardOwner(user, null)).toBe(false);
    });

    it("compares formatted addresses", () => {
      expect(isBoardOwner(user, { formattedAddress: "123 Main" } as any)).toBe(
        true,
      );
      expect(isBoardOwner(user, { formattedAddress: "other" } as any)).toBe(
        false,
      );
    });
  });
});
