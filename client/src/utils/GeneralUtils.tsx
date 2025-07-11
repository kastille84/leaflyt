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
function getCategoriesForSelect(categories: any[]) {
  const categoriesForSelect = [...categories].map((categoryObj: any) => ({
    value: categoryObj.category,
    label: categoryObj.category,
  }));

  categoriesForSelect.unshift({ value: "", label: "Choose a category" });
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

export {
  shortenTitle,
  accessNestedProperty,
  getCategories,
  getCategoriesForSelect,
  getSubcategories,
  getSubcategoriesForSelect,
};
