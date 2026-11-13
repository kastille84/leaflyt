import { deleteFileOverTime } from "../../src/services/cloudinary";

const fetchMock = vi.fn();

describe("cloudinary", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("posts the delete token to cloudinary", async () => {
    fetchMock.mockResolvedValue({});
    await deleteFileOverTime({ delete_token: "tok" } as any);
    const [url, options] = fetchMock.mock.calls[0];
    expect(url).toMatch(
      /^https:\/\/api\.cloudinary\.com\/v1_1\/.*\/delete_by_token$/,
    );
    expect(options.method).toBe("POST");
    expect(options.body).toBe("token=tok");
  });

  it("throws when the request fails", async () => {
    fetchMock.mockRejectedValue(new Error("network"));
    await expect(
      deleteFileOverTime({ delete_token: "tok" } as any),
    ).rejects.toThrow("network");
  });
});
