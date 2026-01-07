import { Plan } from "../interfaces/Plan";

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

function getSubcategoriesForSelect(
  categories: any,
  categoryToFind: string,
  defaultSubcategoryText?: string
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
  return plans.map((plan: Plan) => ({
    value: plan.id.toString(),
    label: plan.name,
  }));
};

export {
  shortenTitle,
  accessNestedProperty,
  getCategories,
  getCategoriesForSelect,
  getSubcategories,
  getSubcategoriesForSelect,
};
