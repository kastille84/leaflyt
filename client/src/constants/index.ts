export const excludedTypeList = [
  "corporate_office",
  "apartment_building",
  "apartment_complex",
  "condominium_complex",
  "housing_complex",
  "atm",
  "public_bath",
  "bus_stop",
];
// https://cloudinary.com/documentation/upload_widget_reference#parameters
export const FILE_UPLOAD_OPTIONS = [
  {
    // https://cloudinary.com/documentation/upload_widget#third_party_upload_sources
    sources: [
      "local",
      "url",
      "camera",
      "image_search",
      "unsplash",
      "google_drive",
      "shutterstock",
    ],
    multiple: false,
    maxFiles: 1,
    // cropping parameters
    cropping: true,
    croppingShowBackButton: true,
    // upload parameters
    tags: ["anonymous"],
    resourceType: "image",
    // customization parameters
    theme: "minimal",
    buttonCaption: "Upload File(s)",
    // advanced parameters
    showPoweredBy: false,
    // autoMinimize: true,
    return_delete_token: true,
  },
  // LEVEL - 1
  {
    sources: [
      "local",
      "url",
      "camera",
      "image_search",
      "unsplash",
      "google_drive",
      "shutterstock",
    ],
    multiple: true,
    maxFiles: 2,
    // cropping parameters
    cropping: true,
    croppingShowBackButton: true,
    // upload parameters
    tags: ["registered", "unpaid", "seed"],
    resourceType: "image",
    // customization parameters
    theme: "minimal",
    buttonCaption: "Upload File(s)",
    // advanced parameters
    showPoweredBy: false,
    // autoMinimize: true,
    return_delete_token: true,
  },
  // LEVEL - 2
  {
    sources: [
      "local",
      "url",
      "camera",
      "image_search",
      "unsplash",
      "google_drive",
      "shutterstock",
    ],
    multiple: true,
    maxFiles: 4,
    // cropping parameters
    cropping: true,
    croppingShowBackButton: true,
    // upload parameters
    tags: ["registered", "paid", "garden"],
    resourceType: "auto",
    // customization parameters
    theme: "minimal",
    buttonCaption: "Upload File(s)",
    // advanced parameters
    showPoweredBy: false,
    // autoMinimize: true,
    return_delete_token: true,
  },
  // LEVEL - 3
  {
    sources: [
      "local",
      "url",
      "camera",
      "image_search",
      "unsplash",
      "google_drive",
      "shutterstock",
    ],
    multiple: true,
    maxFiles: 6,
    // cropping parameters
    cropping: true,
    croppingShowBackButton: true,
    // upload parameters
    tags: ["registered", "paid", "grove"],
    resourceType: "auto",
    // customization parameters
    theme: "minimal",
    buttonCaption: "Upload File(s)",
    // advanced parameters
    showPoweredBy: false,
    // autoMinimize: true,
    return_delete_token: true,
  },
  // LEVEL - 4
  {
    sources: [
      "local",
      "url",
      "camera",
      "image_search",
      "unsplash",
      "google_drive",
      "shutterstock",
    ],
    multiple: true,
    maxFiles: 10,
    // cropping parameters
    cropping: true,
    croppingShowBackButton: true,
    // upload parameters
    tags: ["registered", "paid", "forest"],
    resourceType: "auto",
    // customization parameters
    theme: "minimal",
    buttonCaption: "Upload File(s)",
    // advanced parameters
    showPoweredBy: false,
    // autoMinimize: true,
    return_delete_token: true,
  },
];

export const UNREGISTERED_FLYER_DESIGN_DEFAULT = {
  top: {
    backgroundColor: "var(--color-grey-600)",
    color: "var(--color-grey-50)",
  },
  outlines: {
    color: "var(--color-grey-600)",
  },
  font: '"DM Sans", sans-serif',
  title: {
    color: "var(--color-grey-700)",
  },
  subcategory: {
    color: "var(--color-orange-600)",
  },
  readMore: {
    color: "var(--color-brand-600)",
  },
  tags: {
    color: "var(--color-blue-400)",
  },
};

export const REGISTERED_FLYER_DESIGN_DEFAULT = {
  top: {
    backgroundColor: "#55a166",
    color: "#f1f1f1",
  },
  outlines: {
    color: "#55a166",
  },
  font: '"DM Sans", sans-serif',
  title: {
    color: "#303030",
  },
  subcategory: {
    color: "#B77739",
  },
  readMore: {
    color: "#2B8A40",
  },
  tags: {
    color: "#6699A2",
  },
};
// export const REGISTERED_FLYER_DESIGN_DEFAULT = {
//   top: {
//     backgroundColor: "var(--color-brand-500)",
//     color: "var(--color-grey-50)",
//   },
//   outlines: {
//     color: "var(--color-brand-500)",
//   },
//   font: '"DM Sans", sans-serif',
//   title: {
//     color: "var(--color-grey-700)",
//   },
//   subcategory: {
//     color: "var(--color-orange-600)",
//   },
//   readMore: {
//     color: "var(--color-brand-600)",
//   },
//   tags: {
//     color: "var(--color-blue-400)",
//   },
// };

export const SIGNUP = "signup";
