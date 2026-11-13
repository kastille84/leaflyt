import {
  addAsset,
  deleteAssets,
  deleteAllAssets,
  assetUsageByFlyer,
  assetUsageByTemplate,
} from "../../src/services/apiAssets";
import { supabase } from "../../src/services/supabase";
import { getLatestUserAfterChanges } from "../../src/services/apiFlyers";
import { queueFrom } from "./supabaseMock";

vi.mock("../../src/services/supabase", () => ({
  supabase: { from: vi.fn(), rpc: vi.fn() },
}));
vi.mock("../../src/services/apiFlyers", () => ({
  getLatestUserAfterChanges: vi.fn(),
}));

const from = supabase.from as any;
const rpc = supabase.rpc as any;
const fetchMock = vi.fn();

describe("apiAssets", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.stubGlobal("fetch", fetchMock);
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe("addAsset", () => {
    it("inserts the asset for the user", async () => {
      const [query] = queueFrom(from, { data: { id: 1 }, error: null });
      const result = await addAsset({ public_id: "a" }, "u1");
      expect(query.insert).toHaveBeenCalledWith([
        { asset_info: { public_id: "a" }, user: "u1" },
      ]);
      expect(result).toEqual({ id: 1 });
    });

    it("returns the error when the insert fails", async () => {
      const error = { message: "bad" };
      queueFrom(from, { data: null, error });
      expect(await addAsset({}, "u1")).toEqual({ data: null, error });
    });
  });

  describe("deleteAssets", () => {
    it("calls the delete endpoint and returns the refreshed user", async () => {
      fetchMock.mockResolvedValue({ json: async () => ({}) });
      (getLatestUserAfterChanges as any).mockResolvedValue({ user: "u" });
      const result = await deleteAssets([{ public_id: "a" }] as any, "u1");
      const [url, options] = fetchMock.mock.calls[0];
      expect(url).toMatch(/\/api\/assets\/delete$/);
      expect(options.method).toBe("DELETE");
      expect(options.headers.user).toBe(JSON.stringify("u1"));
      expect(getLatestUserAfterChanges).toHaveBeenCalledWith("u1", "asset");
      expect(result).toEqual({ user: "u" });
    });

    it("swallows request errors", async () => {
      fetchMock.mockRejectedValue(new Error("network"));
      expect(await deleteAssets([], "u1")).toBeUndefined();
    });
  });

  describe("deleteAllAssets", () => {
    it("returns the endpoint result", async () => {
      fetchMock.mockResolvedValue({ json: async () => ({ ok: true }) });
      const result = await deleteAllAssets(["v"], ["i"]);
      const [url, options] = fetchMock.mock.calls[0];
      expect(url).toMatch(/\/api\/assets\/delete-all$/);
      expect(options.headers.assetvideos).toBe(JSON.stringify(["v"]));
      expect(options.headers.assetimages).toBe(JSON.stringify(["i"]));
      expect(result).toEqual({ ok: true });
    });

    it("returns the error when the request fails", async () => {
      const error = new Error("network");
      fetchMock.mockRejectedValue(error);
      expect(await deleteAllAssets([], [])).toEqual({ data: null, error });
    });
  });

  describe.each([
    ["assetUsageByFlyer", assetUsageByFlyer, "used_by_flyers"],
    ["assetUsageByTemplate", assetUsageByTemplate, "used_by_templates"],
  ])("%s", (_name, fn, column) => {
    const a: any = { public_id: "a" };
    const b: any = { public_id: "b" };

    it("removes the id from deleted assets and adds it to new ones", async () => {
      rpc
        .mockResolvedValueOnce({
          data: { id: 1, [column]: ["x", "target"] },
          error: null,
        })
        .mockResolvedValueOnce({
          data: { id: 2, [column]: ["x"] },
          error: null,
        });
      const [removeQuery, addQuery] = queueFrom(
        from,
        { data: null, error: null },
        { data: null, error: null },
      );

      await fn([a], [b], "target");

      expect(rpc).toHaveBeenNthCalledWith(1, "find_asset_by_public_id", {
        asset_public_id: "a",
      });
      expect(rpc).toHaveBeenNthCalledWith(2, "find_asset_by_public_id", {
        asset_public_id: "b",
      });
      expect(removeQuery.update).toHaveBeenCalledWith({ [column]: ["x"] });
      expect(removeQuery.eq).toHaveBeenCalledWith("id", 1);
      expect(addQuery.update).toHaveBeenCalledWith({
        [column]: ["x", "target"],
      });
      expect(addQuery.eq).toHaveBeenCalledWith("id", 2);
    });

    it("does nothing when assets are unchanged", async () => {
      await fn([a], [a], "target");
      expect(rpc).not.toHaveBeenCalled();
      expect(from).not.toHaveBeenCalled();
    });

    it("throws when finding an asset fails", async () => {
      rpc.mockResolvedValue({ data: null, error: { message: "rpc fail" } });
      await expect(fn([a], [], "target")).rejects.toThrow(
        "Error adding the flyer to assets: rpc fail",
      );
      await expect(fn([], [b], "target")).rejects.toThrow("rpc fail");
    });

    it("throws when updating an asset fails", async () => {
      rpc.mockResolvedValue({
        data: { id: 1, [column]: ["target"] },
        error: null,
      });
      queueFrom(from, { data: null, error: { message: "update fail" } });
      await expect(fn([a], [], "target")).rejects.toThrow("update fail");

      queueFrom(from, { data: null, error: { message: "update fail 2" } });
      await expect(fn([], [b], "target")).rejects.toThrow("update fail 2");
    });
  });
});
