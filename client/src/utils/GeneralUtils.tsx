import { Auth_User_Profile_Response } from "../interfaces/Auth_User";
import { DB_Flyers_Response, DB_Saved_Flyer } from "../interfaces/DB_Flyers";

function shortenTitle(title: string, length: number) {
  if (title.length > length) {
    return title.substring(0, length) + "...";
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
  defaultCategoryText?: string
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
    (categoryObj: any) => categoryObj.category === categoryToFind
  ).subcategories;
}

function getSubcategoriesForSelect(categories: any, categoryToFind: string) {
  const subcategories = categories
    .find((categoryObj: any) => categoryObj.category === categoryToFind)
    .subcategories.map((subcategory: any) => ({
      value: subcategory,
      label: subcategory,
    }));
  subcategories.unshift({ value: "", label: "Choose a subcategory" });
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

export const groupFlyersToTemplates = (
  user: Auth_User_Profile_Response | null
) => {
  const groupedFlyers: any = {};
  user?.flyers.forEach((flyer: any) => {
    if (groupedFlyers[flyer.template]) {
      groupedFlyers[flyer.template].push(flyer);
    } else {
      groupedFlyers[flyer.template] = [flyer];
    }
  });
  return groupedFlyers;
};

// check saved_flyers arr to see if current flyer has already been saved
export const checkIfCurrentFlyerIsSaved = (
  saved_flyers: DB_Saved_Flyer[],
  currentFlyer: DB_Flyers_Response
) => {
  return saved_flyers.some((saved_flyer) => {
    return saved_flyer.flyer.id === currentFlyer.id;
  });
};

export const checkIfCurrentFlyerIsLiked = (
  likedFlyers: string[],
  currentFlyerId: string
) => {
  return likedFlyers.some((likedFlyerId) => {
    return likedFlyerId === currentFlyerId;
  });
};

export {
  shortenTitle,
  accessNestedProperty,
  getCategories,
  getCategoriesForSelect,
  getSubcategories,
  getSubcategoriesForSelect,
};
