import { logQrScan } from "../../src/services/apiQrAnalytics";
import { supabase } from "../../src/services/supabase";
import { queueFrom } from "./supabaseMock";

vi.mock("../../src/services/supabase", () => ({
  supabase: { from: vi.fn() },
}));

const from = supabase.from as any;
const place: any = {
  id: "p1",
  displayName: { text: "Place" },
  formattedAddress: "1 Main St",
};

describe("apiQrAnalytics", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("logs the scan", async () => {
    const [query] = queueFrom(from, { data: { id: 1 }, error: null });
    expect(await logQrScan(place)).toEqual({ id: 1 });
    expect(from).toHaveBeenCalledWith("qr_analytics");
    const inserted = query.insert.mock.calls[0][0];
    expect(inserted).toMatchObject({
      placeId: "p1",
      name: "Place",
      formattedAddress: "1 Main St",
    });
    expect(inserted.scanDate).toEqual(expect.any(String));
  });

  it("returns the error when the insert fails", async () => {
    const error = { message: "bad" };
    queueFrom(from, { data: null, error });
    expect(await logQrScan(place)).toEqual({ data: null, error });
  });
});
