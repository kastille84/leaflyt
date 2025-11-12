import { DB_Flyers_Response } from "../../../src/interfaces/DB_Flyers";

export const mockCreatedFlyer: DB_Flyers_Response = {
  id: "9bf5ecdb-803b-4dd3-914b-8562dca7e0ce",
  tags: ["some", "new", "product"],
  user: 3,
  place: {
    id: "10",
    name: "Primo’s Diner & Restaurant",
    tags: [
      "diner",
      "breakfast_restaurant",
      "restaurant",
      "food",
      "point_of_interest",
      "establishment",
    ],
    latlng: {
      latitude: 41.5012924,
      longitude: -74.02644049999999,
    },
    placeId: "ChIJXzcY3QYy3YkRgdNybVw3Hh0",
    // created_at: 2025-06-24T21:57:30.003619+00:00,
    formattedAddress: "410 Broadway, Newburgh, NY 12550, USA",
  },
  title: "Facial Cleanser",
  content:
    "<p>This is a new product that is not on the market yet. It will be available June of next year. The product is of use to anyone and everyone.</p>",
  business: null,
  category: "Goods for Sale/Wanted",
  lifespan: 2,
  template: 2,
  created_at: "2025-08-13T12:37:44.903456+00:00",
  fileUrlArr: [
    {
      id: "uw-file3",
      url: "http://res.cloudinary.com/da1vklj20/image/upload/v1755088507/uarydvaamcnioupkltd4.jpg",
      etag: "e50e507b29812217aab45d644ce1d7fb",
      path: "v1755088507/uarydvaamcnioupkltd4.jpg",
      tags: ["registered", "unpaid", "seed"],
      type: "upload",
      bytes: 52002,
      width: 640,
      format: "jpg",
      height: 640,
      batchId: "uw-batch2",
      version: 1755088507,
      asset_id: "c4880a38672c96ede799edec775df812",
      public_id: "uarydvaamcnioupkltd4",
      signature: "de823519937050a59ca10ad0604c365e9c7b23e0",
      created_at: "2025-08-13T12:35:07Z",
      secure_url:
        "https://res.cloudinary.com/da1vklj20/image/upload/v1755088507/uarydvaamcnioupkltd4.jpg",
      version_id: "a7cce1f065304315ab48d8529bd0cecb",
      placeholder: false,
      asset_folder: "flyers",
      delete_token:
        "a756f62d4d83a5e3ef462301cde2bad547f9d7015d7fa8d9990d40276f7340544ce8cca54c925e2c1265b34b5f912291247dc55135e292ae0a8f6bd8d1ac9d2e51a524b0cbcb385aaf350690f6d30b2176e25022616d2216848465e781b13c7140caa14c13b0f71fbf8ea78464fd87d29081dd1793267562acbaf33a28264073",
      display_name: "photo-1754817408912-49aa34c270c3",
      resource_type: "image",
      thumbnail_url:
        "https://res.cloudinary.com/da1vklj20/image/upload/c_limit,h_60,w_90/v1755088507/uarydvaamcnioupkltd4.jpg",
      original_filename: "photo-1754817408912-49aa34c270c3",
    },
    {
      id: "uw-file3",
      url: "http://res.cloudinary.com/da1vklj20/image/upload/v1760013579/f6kd5g2iass8rkyw9hht.jpg",
      etag: "67242fb1b83397606c13a1a926ec004a",
      path: "v1760013579/f6kd5g2iass8rkyw9hht.jpg",
      tags: ["registered", "paid", "grove"],
      type: "upload",
      bytes: 43856,
      width: 800,
      format: "jpg",
      height: 640,
      batchId: "uw-batch2",
      version: 1760013579,
      asset_id: "4528ff7b5366d1c5ea60029cec752598",
      public_id: "f6kd5g2iass8rkyw9hht",
      signature: "c75ea2e6f32819a6c3b26b94c763506225ec451c",
      created_at: "2025-10-09T12:39:39Z",
      secure_url:
        "https://res.cloudinary.com/da1vklj20/image/upload/v1760013579/f6kd5g2iass8rkyw9hht.jpg",
      version_id: "45713d5a52bdf213b7b2d8c696f68fe3",
      placeholder: false,
      asset_folder: "flyers",
      delete_token:
        "da94f2ec6a53584e8e7a72374f07e9bf4c9d871f40bdfee53f57e90ac9f7103846d19ddc34713222244696355b8cda3a0788f6325b7bb427af73841e819fecdfbc8c66dc7cd3f6e9695a9df4b1f5b925566f83c5aba3964e56d2045c66a968889eeb55e3ca3b4feb860a40df0778ca2efd830b9a172b5c2ebd4c30cde44cf0d2",
      display_name: "photo-1758155738651-acbb2a2491ca",
      resource_type: "image",
      thumbnail_url:
        "https://res.cloudinary.com/da1vklj20/image/upload/c_limit,h_60,w_90/v1760013579/f6kd5g2iass8rkyw9hht.jpg",
      original_filename: "photo-1758155738651-acbb2a2491ca",
    },
  ],
  individual: null,
  typeOfUser: null,
  attestation: null,
  flyerDesign: {
    top: {
      color: "#f1f1f1",
      backgroundColor: "#a18e55",
    },
    font: '"Noto Serif", serif',
    tags: {
      color: "#851572",
    },
    title: {
      color: "#4a663e",
    },
    outlines: {
      color: "#55a166",
    },
    readMore: {
      color: "#392b8a",
    },
    subcategory: {
      color: "#B77739",
    },
    borderTopLeftRadius: 0,
    borderTopRightRadius: 15,
    borderBottomLeftRadius: 13,
    borderBottomRightRadius: 0,
  },
  subcategory: "For Sale",
  callToAction: {
    ctaType: "offer",
    headline: "20% off for early adopters",
    instructions:
      "<p>Go to the website and enter your email. As a gift for being an early adopter you will get a 20% off code</p>",
  },
  organization: null,
  postingMethod: "onLocation",
};
