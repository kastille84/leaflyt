import {
  getUserProfile,
  updateUserProfile,
  updateUserProfilePlan,
} from "../../src/services/apiUser";
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

describe("apiUser", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe("getUserProfile", () => {
    it("returns the profile", async () => {
      const [query] = queueFrom(from, { data: { id: "u1" }, error: null });
      expect(await getUserProfile("u1")).toEqual({
        data: { id: "u1" },
        error: null,
      });
      expect(query.eq).toHaveBeenCalledWith("id", "u1");
    });

    it("returns the error when the query fails", async () => {
      queueFrom(from, { data: null, error: { message: "bad" } });
      const result = await getUserProfile("u1");
      expect(result.data).toBeNull();
      expect((result.error as Error).message).toBe("bad");
    });
  });

  describe("updateUserProfile", () => {
    const profile = {
      individual: {
        name: { firstName: "F", lastName: "L" },
        contact: { website: "iw", phone: "ip" },
      },
      business: { name: "B", contact: { website: "bw", phone: "bp" } },
      organization: { name: "O", contact: { website: "ow", phone: "op" } },
    };

    it.each([
      ["individual", { firstName: "F", lastName: "L", website: "iw", phone: "ip" }],
      ["business", { name: "B", website: "bw", phone: "bp" }],
      ["organization", { name: "O", website: "ow", phone: "op" }],
      ["other", { website: "", phone: "" }],
    ])("updates the profile for a %s", async (type, expected) => {
      const [query] = queueFrom(from, { data: null, error: null });
      (getLatestUserAfterChanges as any).mockResolvedValue({ user: "latest" });
      const result = await updateUserProfile({
        profile,
        typeOfUser: type,
        userId: "u1",
      });
      expect(query.update).toHaveBeenCalledWith([expected]);
      expect(query.eq).toHaveBeenCalledWith("id", "u1");
      expect(getLatestUserAfterChanges).toHaveBeenCalledWith(
        "u1",
        "updated profile",
      );
      expect(result).toEqual({ user: "latest" });
    });

    it("returns the error when the update fails", async () => {
      const error = { message: "bad" };
      queueFrom(from, { data: null, error });
      expect(
        await updateUserProfile({
          profile,
          typeOfUser: "business",
          userId: "u1",
        }),
      ).toEqual({ data: null, error });
    });
  });

  describe("updateUserProfilePlan", () => {
    it("updates the plan as a number", async () => {
      const [query] = queueFrom(from, { data: null, error: null });
      (getLatestUserAfterChanges as any).mockResolvedValue({ user: "latest" });
      const result = await updateUserProfilePlan("u1", "3" as any);
      expect(query.update).toHaveBeenCalledWith([{ plan: 3 }]);
      expect(result).toEqual({ user: "latest" });
    });

    it("returns the error when the update fails", async () => {
      const error = { message: "bad" };
      queueFrom(from, { data: null, error });
      expect(await updateUserProfilePlan("u1", 2)).toEqual({
        data: null,
        error,
      });
    });
  });
});
