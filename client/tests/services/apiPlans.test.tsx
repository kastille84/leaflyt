import { getPlans } from "../../src/services/apiPlans";
import { supabase } from "../../src/services/supabase";
import { queueFrom } from "./supabaseMock";

vi.mock("../../src/services/supabase", () => ({
  supabase: { from: vi.fn() },
}));

const from = supabase.from as any;

describe("apiPlans", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("returns the plans", async () => {
    queueFrom(from, { data: [{ id: 1 }], error: null });
    expect(await getPlans()).toEqual({ data: [{ id: 1 }], error: null });
    expect(from).toHaveBeenCalledWith("plans");
  });

  it("returns the error when the query fails", async () => {
    const error = { message: "bad" };
    queueFrom(from, { data: null, error });
    expect(await getPlans()).toEqual({ data: null, error });
  });
});
