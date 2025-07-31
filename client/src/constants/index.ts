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

export const SIGNUP = "signup";
