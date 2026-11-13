import { getPlaceDetails } from "../../src/services/googleMaps";

const fetchMock = vi.fn();

describe("googleMaps", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("fetches the place details", async () => {
    const place = { id: "p1" };
    fetchMock.mockResolvedValue({ ok: true, json: async () => place });
    expect(await getPlaceDetails("p1")).toEqual(place);
    const [url, options] = fetchMock.mock.calls[0];
    expect(url).toBe("https://places.googleapis.com/v1/places/p1");
    expect(options.method).toBe("GET");
    expect(options.headers["X-Goog-FieldMask"]).toContain("formattedAddress");
  });

  it("throws on a non-ok response", async () => {
    fetchMock.mockResolvedValue({ ok: false, status: 404 });
    await expect(getPlaceDetails("p1")).rejects.toThrow(
      "HTTP error! Status: 404",
    );
  });

  it("throws when no place is returned", async () => {
    fetchMock.mockResolvedValue({ ok: true, json: async () => null });
    await expect(getPlaceDetails("p1")).rejects.toThrow(
      "The requested location was not found.",
    );
  });

  it("throws when the request fails", async () => {
    fetchMock.mockRejectedValue(new Error("network"));
    await expect(getPlaceDetails("p1")).rejects.toThrow(
      "Error fetching nearby boards. Please try again. - Reason: network",
    );
  });
});
