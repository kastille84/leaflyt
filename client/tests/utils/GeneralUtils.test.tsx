import {
  shortenTitle,
  accessNestedProperty,
  getCategories,
  getCategoriesForSelect,
  getSubcategories,
  getSubcategoriesForSelect,
  debounce,
  sortPlansByLevel,
  getPlansForSelect,
  keysBasedOnEnv,
  determineIsFullFlyer,
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

  it("should strip html tags when shortening a title", () => {
    expect(shortenTitle("<b>Hello</b> <i>World</i>", 5)).toBe("Hello...");
  });

  it("should return the object for an empty path", () => {
    const obj = { a: 1 };
    expect(accessNestedProperty(obj, "")).toBe(obj);
  });

  it("should return undefined for a missing nested path", () => {
    expect(accessNestedProperty({ a: { b: 1 } }, "a.c")).toBeUndefined();
    expect(accessNestedProperty({ a: 1 }, "a.b")).toBeUndefined();
    expect(accessNestedProperty({ a: null }, "a.b")).toBeUndefined();
  });

  it("should use custom default texts in the select options", () => {
    expect(
      getCategoriesForSelect(shortCategoriesList, "Pick one")[0],
    ).toEqual({ value: "", label: "Pick one" });
    expect(
      getSubcategoriesForSelect(shortCategoriesList, "Services", "Pick sub")[0],
    ).toEqual({ value: "", label: "Pick sub" });
  });

  describe("debounce", () => {
    beforeEach(() => vi.useFakeTimers());
    afterEach(() => vi.useRealTimers());

    it("should call the function once with the last arguments", () => {
      const fn = vi.fn();
      const debounced = debounce(fn, 100);
      debounced("a");
      debounced("b");
      vi.advanceTimersByTime(99);
      expect(fn).not.toHaveBeenCalled();
      vi.advanceTimersByTime(1);
      expect(fn).toHaveBeenCalledTimes(1);
      expect(fn).toHaveBeenCalledWith("b");
    });
  });

  describe("plans", () => {
    const plans: any[] = [
      { id: 3, name: "Pro", level: 3 },
      { id: 1, name: "Seed", level: 1 },
      { id: 2, name: "Sprout", level: 2 },
    ];

    it("should sort plans by level", () => {
      expect(sortPlansByLevel([...plans]).map((p) => p.id)).toEqual([1, 2, 3]);
    });

    it("should map plans to select options", () => {
      expect(getPlansForSelect([...plans])).toEqual([
        { value: "1", label: "Seed" },
        { value: "2", label: "Sprout" },
        { value: "3", label: "Pro" },
      ]);
    });
  });

  // The production branch is untestable: Vite `define` inlines import.meta.env.MODE.
  it("should return the keys for each service", () => {
    const keys = keysBasedOnEnv();
    expect(Object.keys(keys).sort()).toEqual(
      ["cloudinary", "disqus", "google", "stripe", "supabase"].sort(),
    );
    expect(keys.supabase).toHaveProperty("url");
    expect(keys.supabase).toHaveProperty("apiKey");
    expect(keys.google).toHaveProperty("mapsApiKey");
  });

  describe("determineIsFullFlyer", () => {
    afterEach(() => window.history.pushState({}, "", "/"));

    it("should be true on a full flyer path", () => {
      window.history.pushState({}, "", "/fullFlyer/1");
      expect(determineIsFullFlyer()).toBe(true);
    });

    it("should be false elsewhere", () => {
      window.history.pushState({}, "", "/home");
      expect(determineIsFullFlyer()).toBe(false);
    });
  });
});
