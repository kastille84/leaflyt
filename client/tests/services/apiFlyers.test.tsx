import {
  getFlyerById,
  createUnregisteredFlyer,
  createRegisteredFlyer,
  updateRegisteredFlyer,
  createFlyerFromTemplate,
  deleteFlyer,
  updateTemplate,
  createTemplate,
  deleteTemplate,
  saveFlyer,
  removeSavedFlyer,
  likeFlyer,
  flagFlyer,
  getLatestUserAfterChanges,
  updateUserPowerUserStatus,
  moderateContent,
  sendFlaggedFlyerEmail,
} from "../../src/services/apiFlyers";
import { supabase } from "../../src/services/supabase";
import { createBoard, getBoard } from "../../src/services/apiBoards";
import { getUserProfile } from "../../src/services/apiUser";
import {
  assetUsageByFlyer,
  assetUsageByTemplate,
} from "../../src/services/apiAssets";
import { makeQuery, queueFrom } from "./supabaseMock";

vi.mock("../../src/services/supabase", () => ({
  supabase: { from: vi.fn(), rpc: vi.fn() },
}));
vi.mock("../../src/services/apiBoards", () => ({
  getBoard: vi.fn(),
  createBoard: vi.fn(),
}));
vi.mock("../../src/services/apiUser", () => ({ getUserProfile: vi.fn() }));
vi.mock("../../src/services/apiAssets", () => ({
  assetUsageByFlyer: vi.fn(),
  assetUsageByTemplate: vi.fn(),
}));

const from = supabase.from as any;
const rpc = supabase.rpc as any;
const fetchMock = vi.fn();

const place: any = {
  id: "place1",
  displayName: { text: "Place" },
  formattedAddress: "1 Main St",
  location: { latitude: 1, longitude: 2 },
  types: ["cafe"],
};
const ok = { data: null, error: null };

function setSearch(search: string) {
  window.history.replaceState({}, "", `/${search}`);
}

describe("apiFlyers", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    from.mockImplementation(() => makeQuery(ok));
    (getBoard as any).mockResolvedValue({ data: { id: 1 }, error: null });
    (getUserProfile as any).mockResolvedValue({
      data: { id: "u1", powerUser: false, flyers: [] },
      error: null,
    });
    vi.stubGlobal("fetch", fetchMock);
    vi.spyOn(console, "error").mockImplementation(() => {});
    setSearch("");
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    setSearch("");
  });

  describe("getFlyerById", () => {
    it("returns the flyer", async () => {
      const [query] = queueFrom(from, { data: { id: "f1" }, error: null });
      expect(await getFlyerById("f1")).toEqual({ id: "f1" });
      expect(query.eq).toHaveBeenCalledWith("id", "f1");
    });

    it("throws when the query fails", async () => {
      queueFrom(from, { data: null, error: { message: "nope" } });
      await expect(getFlyerById("f1")).rejects.toThrow(
        "Error getting flyer by id",
      );
    });
  });

  describe("createUnregisteredFlyer", () => {
    it("creates the flyer on an existing board", async () => {
      const [query] = queueFrom(from, { data: { id: "f1" }, error: null });
      const result = await createUnregisteredFlyer(
        { title: "T", lifespan: 2 } as any,
        place,
      );
      expect(createBoard).not.toHaveBeenCalled();
      const inserted = query.insert.mock.calls[0][0][0];
      expect(inserted).toMatchObject({
        title: "T",
        place: "place1",
        likes: 0,
      });
      expect(inserted.expires_at).toBeTruthy();
      expect(result).toEqual({ id: "f1" });
    });

    it("creates the board first when it does not exist", async () => {
      (getBoard as any).mockResolvedValue({ data: {}, error: { m: "x" } });
      (createBoard as any).mockResolvedValue({ data: { id: 2 }, error: null });
      queueFrom(from, { data: { id: "f1" }, error: null });
      await createUnregisteredFlyer({ title: "T" } as any, place);
      expect(createBoard).toHaveBeenCalledWith({
        placeId: "place1",
        name: "Place",
        formattedAddress: "1 Main St",
        latlng: place.location,
        tags: ["cafe"],
      });
    });

    it("throws when creating the board fails", async () => {
      (getBoard as any).mockResolvedValue({ data: {}, error: { m: "x" } });
      (createBoard as any).mockRejectedValue(new Error("boom"));
      await expect(
        createUnregisteredFlyer({ title: "T" } as any, place),
      ).rejects.toThrow("Error prepping the board to create a flyer");
    });

    it("throws when the insert fails", async () => {
      queueFrom(from, { data: null, error: { message: "bad insert" } });
      await expect(
        createUnregisteredFlyer({ title: "T" } as any, place),
      ).rejects.toThrow("Error creating a flyer");
    });
  });

  describe("createRegisteredFlyer", () => {
    const flyerData = () =>
      ({
        user: "u1",
        title: "T",
        lifespan: 1,
        fileUrlArr: [{ public_id: "a" }],
      }) as any;

    it("creates a flyer without a template", async () => {
      const [query] = queueFrom(from, { data: { id: "f1", user: "u1" } });
      const result = await createRegisteredFlyer(flyerData(), place);
      expect(from).toHaveBeenCalledTimes(1);
      expect(query.insert.mock.calls[0][0][0]).toMatchObject({
        place: "place1",
        user: "u1",
        postingMethod: "onLocation",
        likes: 0,
      });
      expect(assetUsageByFlyer).toHaveBeenCalledWith(
        [],
        [{ public_id: "a" }],
        "f1",
      );
      expect(result.error).toBeNull();
    });

    it("creates a template first when requested", async () => {
      const [templateQuery, flyerQuery] = queueFrom(
        from,
        { data: { id: "t1" }, error: null },
        { data: { id: "f1", user: "u1" }, error: null },
      );
      const data = { ...flyerData(), template: true, templateName: "TN" };
      await createRegisteredFlyer(data, place);
      expect(from).toHaveBeenNthCalledWith(1, "templates");
      expect(from).toHaveBeenNthCalledWith(2, "flyers");
      expect(templateQuery.insert.mock.calls[0][0][0].templateName).toBe("TN");
      expect(assetUsageByTemplate).toHaveBeenCalledWith(
        [],
        [{ public_id: "a" }],
        "t1",
      );
      expect(flyerQuery.insert.mock.calls[0][0][0].template).toBe("t1");
      expect(data.template).toBeUndefined();
    });

    it("throws when creating the template fails", async () => {
      queueFrom(from, { data: null, error: { message: "tpl" } });
      await expect(
        createRegisteredFlyer({ ...flyerData(), template: true }, place),
      ).rejects.toThrow("Error creating a template");
    });

    it.each([
      ["?pt=r", "remote"],
      ["?pt=rb", "remoteBulk"],
      ["?pt=other", "onLocation"],
    ])("maps %s to posting method %s", async (search, expected) => {
      setSearch(search);
      const [query] = queueFrom(from, { data: { id: "f1", user: "u1" } });
      await createRegisteredFlyer(flyerData(), place);
      expect(query.insert.mock.calls[0][0][0].postingMethod).toBe(expected);
    });

    it("throws when the flyer insert fails", async () => {
      queueFrom(from, { data: null, error: { message: "flyer" } });
      await expect(createRegisteredFlyer(flyerData(), place)).rejects.toThrow(
        "Error creating a flyer",
      );
    });
  });

  describe("updateRegisteredFlyer", () => {
    it("updates the flyer and detaches it from its template", async () => {
      const [query] = queueFrom(from, {
        data: { id: "f1", user: "u1" },
        error: null,
      });
      const data: any = { id: "f1", template: "t1", fileUrlArr: [] };
      const result = await updateRegisteredFlyer(data, place, []);
      expect(data.template).toBeNull();
      expect(query.update).toHaveBeenCalledWith(data);
      expect(query.eq).toHaveBeenCalledWith("id", "f1");
      expect(assetUsageByFlyer).toHaveBeenCalledWith([], [], "f1");
      expect(result.error).toBeNull();
    });

    it("throws when the update fails", async () => {
      queueFrom(from, { data: null, error: { message: "bad" } });
      await expect(
        updateRegisteredFlyer({ id: "f1" } as any, place, []),
      ).rejects.toThrow("Error updating the flyer");
    });
  });

  describe("createFlyerFromTemplate", () => {
    const template: any = {
      id: "t1",
      templateName: "TN",
      title: "T",
      lifespan: 1,
      hasComments: true,
      created_at: "now",
      fileUrlArr: [{ public_id: "a" }],
      user: { id: "u1" },
    };
    const user: any = { id: "u1", typeOfUser: "business" };

    it("inserts a flyer built from the template", async () => {
      const [query] = queueFrom(from, { data: { id: "f1" }, error: null });
      const result = await createFlyerFromTemplate(template, place, user);
      const inserted = query.insert.mock.calls[0][0][0];
      expect(inserted).toMatchObject({
        title: "T",
        place: "place1",
        user: "u1",
        template: "t1",
        typeOfUser: "business",
        likes: 0,
        hasComments: true,
        postingMethod: "onLocation",
      });
      expect(inserted.id).toBeUndefined();
      expect(inserted.templateName).toBeUndefined();
      expect(inserted.created_at).toBeUndefined();
      expect(assetUsageByFlyer).toHaveBeenCalledWith(
        [],
        [{ public_id: "a" }],
        "f1",
      );
      expect(result.error).toBeNull();
    });

    it.each([
      ["?pt=r", "remote"],
      ["?pt=rb", "remoteBulk"],
      ["?pt=zzz", "onLocation"],
    ])("maps %s to %s", async (search, expected) => {
      setSearch(search);
      const [query] = queueFrom(from, { data: { id: "f1" }, error: null });
      await createFlyerFromTemplate(template, place, user);
      expect(query.insert.mock.calls[0][0][0].postingMethod).toBe(expected);
    });

    it("throws when the insert fails", async () => {
      queueFrom(from, { data: null, error: { message: "bad" } });
      await expect(
        createFlyerFromTemplate(template, place, user),
      ).rejects.toThrow("Error creating a flyer");
    });
  });

  describe("deleteFlyer", () => {
    const flyer: any = {
      id: "f1",
      fileUrlArr: [{ public_id: "a" }],
      user: { id: "u1" },
    };

    it("deletes the flyer and releases its assets", async () => {
      const [query] = queueFrom(from, ok);
      const result = await deleteFlyer(flyer);
      expect(query.delete).toHaveBeenCalled();
      expect(query.eq).toHaveBeenCalledWith("id", "f1");
      expect(assetUsageByFlyer).toHaveBeenCalledWith(
        [{ public_id: "a" }],
        [],
        "f1",
      );
      expect(result.error).toBeNull();
    });

    it("throws when a later step fails", async () => {
      (assetUsageByFlyer as any).mockRejectedValue(new Error("assets"));
      await expect(deleteFlyer(flyer)).rejects.toThrow(
        "Error deleting the flyer: assets",
      );
    });
  });

  describe("updateTemplate", () => {
    const template: any = {
      id: "t1",
      title: "T",
      user: "u1",
      fileUrlArr: [{ public_id: "a" }],
    };

    it("updates the template and its flyers", async () => {
      const [tplQuery, flyersQuery] = queueFrom(from, ok, ok);
      const result = await updateTemplate(template, []);
      expect(from).toHaveBeenNthCalledWith(1, "templates");
      expect(from).toHaveBeenNthCalledWith(2, "flyers");
      expect(tplQuery.update).toHaveBeenCalledWith(template);
      expect(flyersQuery.eq).toHaveBeenCalledWith("template", "t1");
      expect(assetUsageByTemplate).toHaveBeenCalledWith(
        [],
        [{ public_id: "a" }],
        "t1",
      );
      expect(result.error).toBeNull();
    });

    it("throws when the template update fails", async () => {
      queueFrom(from, { data: null, error: { message: "tpl" } });
      await expect(updateTemplate(template, [])).rejects.toThrow(
        "Error updating the template",
      );
    });

    it("throws when updating the flyers fails", async () => {
      queueFrom(from, ok, { data: null, error: { message: "flyers" } });
      await expect(updateTemplate(template, [])).rejects.toThrow(
        "Error updating all flyers belonging to the template",
      );
    });
  });

  describe("createTemplate", () => {
    const template: any = {
      user: "u1",
      templateName: "TN",
      fileUrlArr: [{ public_id: "a" }],
    };

    it("creates the template and tracks assets", async () => {
      const [query] = queueFrom(from, { data: { id: "t1" }, error: null });
      const result = await createTemplate(template);
      expect(query.insert.mock.calls[0][0][0]).toMatchObject({
        user: "u1",
        templateName: "TN",
        likes: 0,
      });
      expect(assetUsageByTemplate).toHaveBeenCalledWith(
        [],
        [{ public_id: "a" }],
        "t1",
      );
      expect(result.error).toBeNull();
    });

    it("throws when the insert fails", async () => {
      queueFrom(from, { data: null, error: { message: "bad" } });
      await expect(createTemplate(template)).rejects.toThrow(
        "Error creating a template",
      );
    });
  });

  describe("deleteTemplate", () => {
    const template: any = {
      id: "t1",
      fileUrlArr: [{ public_id: "a" }],
      user: { id: "u1" },
    };

    it("deletes the template and releases assets", async () => {
      const [query] = queueFrom(from, ok);
      const result = await deleteTemplate(template);
      expect(query.eq).toHaveBeenCalledWith("id", "t1");
      expect(assetUsageByTemplate).toHaveBeenCalledWith(
        [{ public_id: "a" }],
        [],
        "t1",
      );
      expect(result.error).toBeNull();
    });

    it("throws when the delete fails", async () => {
      queueFrom(from, { data: null, error: { message: "bad" } });
      await expect(deleteTemplate(template)).rejects.toThrow(
        "Error deleting the template",
      );
    });
  });

  describe("saveFlyer", () => {
    it("inserts a saved flyer and returns the user", async () => {
      const [query] = queueFrom(from, ok);
      const result = await saveFlyer("u1", "f1");
      expect(from).toHaveBeenCalledWith("saved_flyers");
      expect(query.insert).toHaveBeenCalledWith([{ user: "u1", flyer: "f1" }]);
      expect(result.error).toBeNull();
    });

    it("throws when the insert fails", async () => {
      queueFrom(from, { data: null, error: { message: "bad" } });
      await expect(saveFlyer("u1", "f1")).rejects.toThrow(
        "Error saving the flyer",
      );
    });
  });

  describe("removeSavedFlyer", () => {
    it.each([
      ["flyer", "flyer"],
      ["id", "id"],
    ] as const)("filters by %s column", async (type, column) => {
      const [query] = queueFrom(from, ok);
      await removeSavedFlyer("u1", 7, type);
      expect(query.eq).toHaveBeenCalledWith(column, 7);
    });

    it("throws when the delete fails", async () => {
      queueFrom(from, { data: null, error: { message: "bad" } });
      await expect(removeSavedFlyer("u1", 7, "id")).rejects.toThrow(
        "Error removing the saved flyer",
      );
    });
  });

  describe("likeFlyer", () => {
    it("updates flyer and template likes for template flyers", async () => {
      rpc.mockResolvedValue({ data: 4, error: null });
      const result = await likeFlyer({ id: "f1", template: "t1" } as any, "inc");
      expect(rpc).toHaveBeenCalledWith("increment_likes_combined", {
        flyer_id_val: "f1",
        template_id_val: "t1",
        amount: 1,
      });
      expect(result).toEqual({ newLikes: 4, error: null });
    });

    it("updates only the flyer when it has no template", async () => {
      rpc.mockResolvedValue({ data: 2, error: null });
      const result = await likeFlyer({ id: "f1" } as any, "dec");
      expect(rpc).toHaveBeenCalledWith("increment_likes_for_flyer", {
        flyer_id_val: "f1",
        amount: -1,
      });
      expect(result).toEqual({ newLikes: 2, error: null });
    });

    it("throws when the rpc call throws", async () => {
      rpc.mockRejectedValue(new Error("rpc"));
      await expect(likeFlyer({ id: "f1" } as any, "inc")).rejects.toThrow(
        "Error liking the flyer: rpc",
      );
    });
  });

  describe("flagFlyer", () => {
    const args = {
      flyer: { id: "f1", user: { email: "a@b.c" } } as any,
      reason: "spam",
      userId: null,
      placeName: "Place",
    };

    it("flags the flyer and emails its owner", async () => {
      const [query] = queueFrom(from, { data: { id: "f1" }, error: null });
      fetchMock.mockResolvedValue({ json: async () => ({ ok: true }) });
      const result = await flagFlyer(args);
      const update = query.update.mock.calls[0][0];
      expect(update).toMatchObject({ place: null, flagged: true });
      expect(update.flaggedReason).toMatchObject({
        reason: "spam",
        user: "anonymous",
        place: "Place",
      });
      expect(fetchMock.mock.calls[0][0]).toMatch(
        /\/api\/email\/send-flagged-flyer-email$/,
      );
      expect(result).toEqual({ id: "f1" });
    });

    it("does not email when the flyer has no user", async () => {
      queueFrom(from, { data: { id: "f1" }, error: null });
      await flagFlyer({ ...args, flyer: { id: "f1" } as any, userId: "u9" });
      expect(fetchMock).not.toHaveBeenCalled();
    });

    it("throws when the update fails", async () => {
      queueFrom(from, { data: null, error: { message: "bad" } });
      await expect(flagFlyer(args)).rejects.toThrow("Error flagging the flyer");
    });
  });

  describe("getLatestUserAfterChanges", () => {
    it("returns the user", async () => {
      const result = await getLatestUserAfterChanges("u1", "flyer");
      expect(result).toEqual({
        user: { id: "u1", powerUser: false, flyers: [] },
        error: null,
      });
      expect(from).not.toHaveBeenCalled();
    });

    it("throws when the profile request fails", async () => {
      (getUserProfile as any).mockResolvedValue({ data: null, error: "bad" });
      await expect(getLatestUserAfterChanges("u1", "flyer")).rejects.toThrow(
        "Error updating the flyer: bad",
      );
    });

    it("promotes users with 15 or more flyers", async () => {
      (getUserProfile as any).mockResolvedValue({
        data: { powerUser: false, flyers: new Array(15).fill({}) },
        error: null,
      });
      const [query] = queueFrom(from, ok);
      await getLatestUserAfterChanges("u1", "flyer");
      expect(query.update).toHaveBeenCalledWith({ powerUser: true });
    });

    it("demotes power users with fewer than 15 flyers", async () => {
      (getUserProfile as any).mockResolvedValue({
        data: { powerUser: true, flyers: [] },
        error: null,
      });
      const [query] = queueFrom(from, ok);
      await getLatestUserAfterChanges("u1", "flyer");
      expect(query.update).toHaveBeenCalledWith({ powerUser: false });
    });
  });

  describe("updateUserPowerUserStatus", () => {
    it("updates the profile", async () => {
      const [query] = queueFrom(from, { data: { id: "u1" }, error: null });
      const result = await updateUserPowerUserStatus("u1", true);
      expect(from).toHaveBeenCalledWith("profiles");
      expect(query.eq).toHaveBeenCalledWith("id", "u1");
      expect(result).toEqual({ user: { id: "u1" }, error: null });
    });

    it("returns the error when the update fails", async () => {
      const error = { message: "bad" };
      queueFrom(from, { data: null, error });
      expect(await updateUserPowerUserStatus("u1", true)).toEqual({
        data: null,
        error,
      });
    });
  });

  describe("moderateContent", () => {
    const flyerData: any = { title: "T", content: "C" };

    it("returns true when content is not flagged", async () => {
      fetchMock.mockResolvedValue({
        json: async () => ({ data: { results: [{ flagged: false }] } }),
      });
      expect(await moderateContent(flyerData)).toBe(true);
      const [url, options] = fetchMock.mock.calls[0];
      expect(url).toMatch(/\/api\/moderate$/);
      expect(JSON.parse(options.body).message).toContain("T");
    });

    it("throws when content is flagged", async () => {
      fetchMock.mockResolvedValue({
        json: async () => ({ data: { results: [{ flagged: true }] } }),
      });
      await expect(moderateContent(flyerData)).rejects.toThrow(
        "Error Checking Content: Flagged content",
      );
    });

    it("throws when the request fails", async () => {
      fetchMock.mockRejectedValue(new Error("network"));
      await expect(moderateContent(flyerData)).rejects.toThrow(
        "Error Checking Content: network",
      );
    });
  });

  describe("sendFlaggedFlyerEmail", () => {
    const args = { email: "a@b.c", flyer: { id: "f1" } as any };

    it("returns the result", async () => {
      fetchMock.mockResolvedValue({ json: async () => ({ sent: true }) });
      expect(await sendFlaggedFlyerEmail(args)).toEqual({ sent: true });
    });

    it("returns an error when the response has one", async () => {
      fetchMock.mockResolvedValue({ json: async () => ({ error: "bad" }) });
      expect(await sendFlaggedFlyerEmail(args)).toEqual({
        data: null,
        error: "bad",
      });
    });

    it("returns an error when the request throws", async () => {
      const error = new Error("network");
      fetchMock.mockRejectedValue(error);
      expect(await sendFlaggedFlyerEmail(args)).toEqual({ data: null, error });
    });
  });
});
