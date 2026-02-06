import { Plan } from "../interfaces/Plan";

// function stripHtml(html: string) {
//   const tmp = document.createElement("DIV");
//   tmp.innerHTML = html;
//   return tmp.textContent || tmp.innerText || "";
// }

// function to stripHtml and join with a period
// function stripHtml(html: string) {
//   const tmp = document.createElement("DIV");
//   tmp.innerHTML = html;
//   const stripped = tmp.textContent || tmp.innerText || "";
//   return stripped.replace(/<[^>]+>/g, " "); // replace HTML tags with non-breaking space
// }
function stripHtmlAndJoinWithPeriod(html: string): string {
  const tmp = document.createElement("DIV");
  tmp.innerHTML = html;
  const stripped = Array.from(tmp.childNodes)
    .map((node) => node.textContent || "")
    .filter((text) => text.trim() !== "")
    .join(" ");
  return stripped;
}
function shortenTitle(title: string, length: number) {
  const stripped = stripHtmlAndJoinWithPeriod(title);
  if (stripped.length > length) {
    return stripped.substring(0, length) + "...";
  }
  return title;
}

function accessNestedProperty(obj: any, path: string) {
  if (!path) return obj;
  const properties = path.split(".");
  let current = obj;
  for (const prop of properties) {
    if (
      current == null ||
      typeof current !== "object" ||
      !current.hasOwnProperty(prop)
    ) {
      return undefined;
    }
    current = current[prop];
  }
  return current;
}

function getCategories(categories: any[]) {
  return categories.map((categoryObj: any) => categoryObj.category);
}
function getCategoriesForSelect(
  categories: any[],
  defaultCategoryText?: string,
) {
  const categoriesForSelect = [...categories].map((categoryObj: any) => ({
    value: categoryObj.category,
    label: categoryObj.category,
  }));

  categoriesForSelect.unshift({
    value: "",
    label: defaultCategoryText ? defaultCategoryText : "Choose a category",
  });
  return categoriesForSelect;
}

function getSubcategories(categories: any[], categoryToFind: string) {
  return categories.find(
    (categoryObj: any) => categoryObj.category === categoryToFind,
  ).subcategories;
}

function getSubcategoriesForSelect(
  categories: any,
  categoryToFind: string,
  defaultSubcategoryText?: string,
) {
  const subcategories = categories
    .find((categoryObj: any) => categoryObj.category === categoryToFind)
    .subcategories.map((subcategory: any) => ({
      value: subcategory,
      label: subcategory,
    }));
  subcategories.unshift({
    value: "",
    label: defaultSubcategoryText
      ? defaultSubcategoryText
      : "Choose a subcategory",
  });
  return subcategories;
}

export const debounce = (func: any, delay: number) => {
  let timeoutId: any;
  return (...args: any) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
};

export const sortPlansByLevel = (plans: Plan[]) => {
  return plans.sort((a, b) => a.level - b.level);
};

export const getPlansForSelect = (plans: Plan[]) => {
  return sortPlansByLevel(plans).map((plan: Plan) => ({
    value: plan.id.toString(),
    label: plan.name,
  }));
};

export const keysBasedOnEnv = () => {
  if (import.meta.env.MODE === "production") {
    // PRODUCTION
    return {
      // Google Maps
      google: {
        mapsApiKey: import.meta.env.VITE_GOOGLE_MAP_API_KEY,
        mapId: import.meta.env.VITE_GOOGLE_MAP_MY_AREA_MAP_ID,
      },
      // Supabase
      supabase: {
        url: "",
        apiKey: "",
      },
      // Cloudinary
      cloudinary: {
        name: import.meta.env.VITE_CLOUDINARY_NAME,
        preset: import.meta.env.VITE_CLOUDINARY_PRESET_PROD,
      },
      // Stripe
      stripe: {
        publishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY_PROD,
      },
    };
  } else {
    // Non-Prod
    return {
      // Google Maps
      google: {
        mapsApiKey: import.meta.env.VITE_GOOGLE_MAP_API_KEY,
        mapId: import.meta.env.VITE_GOOGLE_MAP_MY_AREA_MAP_ID,
      },
      // Supabase
      supabase: {
        url: import.meta.env.VITE_SUPABASE_URL,
        apiKey: import.meta.env.VITE_SUPABASE_API_KEY,
      },
      // Cloudinary
      cloudinary: {
        name: import.meta.env.VITE_CLOUDINARY_NAME,
        preset: import.meta.env.VITE_CLOUDINARY_PRESET_TEST,
      },
      // Stripe
      stripe: {
        publishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY_TEST,
      },
    };
  }
};

export function determineIsFullFlyer() {
  return location.pathname.includes("fullFlyer");
}

export {
  shortenTitle,
  accessNestedProperty,
  getCategories,
  getCategoriesForSelect,
  getSubcategories,
  getSubcategoriesForSelect,
};
