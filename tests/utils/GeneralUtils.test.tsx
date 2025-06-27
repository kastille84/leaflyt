import {
  shortenTitle,
  accessNestedProperty,
  getCategories,
  getCategoriesForSelect,
  getSubcategories,
  getSubcategoriesForSelect,
} from "../../src/utils/GeneralUtils";

const shortCategoriesList = [
  {
    category: "Services",
    subcategories: [
      "Professional Services",
      "Personal Development/Instruction",
      "Automotive Services",
    ],
  },
];

describe("GeneralUtils", () => {
  it("should shorten title when title is longer than length", () => {
    expect(shortenTitle("Hello World", 5)).toBe("Hello...");
  });

  it("should return title when title is shorter than length", () => {
    expect(shortenTitle("Hello", 5)).toBe("Hello");
  });

  it("should handle accessNestedProperty", () => {
    const obj = {
      a: {
        b: {
          c: "Hello",
        },
      },
    };
    const result = accessNestedProperty(obj, "a.b.c");
    if (result) {
      expect(result).toBe("Hello");
    }
  });
  it("should return original object if patch is empty", () => {
    const obj = {
      a: {
        b: {
          c: "Hello",
        },
      },
    };
    const result = accessNestedProperty(obj, "");
    expect(result).toBe(obj);
  });

  it("should handle getCategories", () => {
    const result = getCategories(shortCategoriesList);
    expect(result).toEqual(["Services"]);
  });

  it("should handle getCategoriesForSelect", () => {
    const result = getCategoriesForSelect(shortCategoriesList);
    expect(result).toEqual([
      { value: "", label: "Choose a category" },
      { value: "Services", label: "Services" },
    ]);
  });

  it("should handle getSubcategories", () => {
    const result = getSubcategories(shortCategoriesList, "Services");
    expect(result).toEqual([
      "Professional Services",
      "Personal Development/Instruction",
      "Automotive Services",
    ]);
  });

  it("should handle getSubcategoriesForSelect", () => {
    const result = getSubcategoriesForSelect(shortCategoriesList, "Services");
    expect(result).toEqual([
      { value: "", label: "Choose a subcategory" },
      { value: "Professional Services", label: "Professional Services" },
      {
        value: "Personal Development/Instruction",
        label: "Personal Development/Instruction",
      },
      { value: "Automotive Services", label: "Automotive Services" },
    ]);
  });
});
