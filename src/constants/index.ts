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
    // widgetParameters: { multiple: false, maxFiles: 1 },
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
];
