import {
  getBaseUrl,
  getContactInfoFromFlyer,
  getContactInfoFromUser,
  parseAdrAddress,
  calculateEndDate,
} from "../../src/utils/ServiceUtils";

const address = { formatted_address: "123 Main St" };

describe("ServiceUtils", () => {
  describe("getBaseUrl", () => {
    // NODE_ENV is statically replaced by Vite's `define` (see vite.config.ts),
    // so only the "test" branch is reachable in browser tests.
    it("returns localhost in test env", () => {
      expect(getBaseUrl()).toBe("http://localhost:5000");
    });
  });

  describe("getContactInfoFromFlyer", () => {
    it("uses registered user with first/last name", () => {
      const flyer: any = {
        user: {
          email: "e",
          phone: "p",
          website: "w",
          firstName: "F",
          lastName: "L",
          address,
        },
      };
      expect(getContactInfoFromFlyer(flyer)).toEqual({
        email: "e",
        phone: "p",
        website: "w",
        firstName: "F",
        lastName: "L",
        address: "123 Main St",
      });
    });

    it("uses registered user with name when no first name", () => {
      const flyer: any = {
        user: { email: "e", phone: "p", website: "w", name: "Biz", address },
      };
      const result = getContactInfoFromFlyer(flyer);
      expect(result.name).toBe("Biz");
      expect(result.firstName).toBeUndefined();
    });

    it("handles unregistered individual", () => {
      const flyer: any = {
        typeOfUser: "individual",
        individual: {
          name: { firstName: "F", lastName: "L" },
          contact: { email: "e", phone: "p", website: "w" },
        },
      };
      expect(getContactInfoFromFlyer(flyer)).toEqual({
        email: "e",
        phone: "p",
        firstName: "F",
        lastName: "L",
        website: "w",
      });
    });

    it.each(["organization", "business"])("handles unregistered %s", (type) => {
      const flyer: any = {
        typeOfUser: type,
        [type]: {
          name: "N",
          contact: { email: "e", phone: "p", website: "w", address: "a" },
        },
      };
      expect(getContactInfoFromFlyer(flyer)).toEqual({
        email: "e",
        phone: "p",
        name: "N",
        website: "w",
        address: "a",
      });
    });

    it("returns empty object for unknown typeOfUser", () => {
      expect(getContactInfoFromFlyer({ typeOfUser: "other" } as any)).toEqual(
        {},
      );
    });

    it("returns undefined with neither user nor typeOfUser", () => {
      expect(getContactInfoFromFlyer({} as any)).toBeUndefined();
    });
  });

  describe("getContactInfoFromUser", () => {
    it("uses first and last name when present", () => {
      const user: any = {
        email: "e",
        phone: "p",
        website: "w",
        firstName: "F",
        lastName: "L",
        address,
      };
      expect(getContactInfoFromUser(user)).toEqual({
        email: "e",
        phone: "p",
        website: "w",
        firstName: "F",
        lastName: "L",
        addres: "123 Main St",
      });
    });

    it("uses name otherwise", () => {
      const user: any = { email: "e", name: "Biz", address };
      expect(getContactInfoFromUser(user).name).toBe("Biz");
    });
  });

  it("parseAdrAddress extracts address parts", () => {
    const adr =
      '<span class="street-address">1 Main St</span>, <span class="locality">Town</span>, <span class="region">NY</span> <span class="postal-code">10001</span>, <span class="country-name">USA</span>';
    expect(parseAdrAddress(adr)).toEqual({
      line1: "1 Main St",
      city: "Town",
      state: "NY",
      postal_code: "10001",
      country: "USA",
    });
  });

  it("parseAdrAddress returns empty strings for missing parts", () => {
    expect(parseAdrAddress("")).toEqual({
      line1: "",
      city: "",
      state: "",
      postal_code: "",
      country: "",
    });
  });

  it("calculateEndDate adds weeks", () => {
    const start = new Date(2025, 0, 1, 12, 0, 0).getTime();
    expect(calculateEndDate(start, 2)).toMatch(
      /^2025-01-15 12:00:00[+-]\d{4}$/,
    );
  });
});
