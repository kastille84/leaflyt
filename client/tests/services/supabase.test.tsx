import { createClient } from "@supabase/supabase-js";
import { supabase, supabaseUrl } from "../../src/services/supabase";
import { keysBasedOnEnv } from "../../src/utils/GeneralUtils";

vi.mock("@supabase/supabase-js", () => ({
  createClient: vi.fn(() => ({ mocked: true })),
}));

describe("supabase", () => {
  it("creates the client from the environment keys", () => {
    const { url, apiKey } = keysBasedOnEnv().supabase;
    expect(supabaseUrl).toBe(url);
    expect(createClient).toHaveBeenCalledWith(url, apiKey);
    expect(supabase).toEqual({ mocked: true });
  });
});
