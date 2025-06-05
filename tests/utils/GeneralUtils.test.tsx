import { shortenTitle } from "../../src/utils/GeneralUtils";

describe("GeneralUtils", () => {
  it("should shorten title when title is longer than length", () => {
    expect(shortenTitle("Hello World", 5)).toBe("Hello...");
  });

  it("should return title when title is shorter than length", () => {
    expect(shortenTitle("Hello", 5)).toBe("Hello");
  });
});
