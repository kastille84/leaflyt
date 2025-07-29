export const placePredictionsArr = [
  {
    description: "754 Broadway, Newburgh, NY, USA",
    matched_substrings: [
      {
        length: 3,
        offset: 0,
      },
      {
        length: 8,
        offset: 4,
      },
      {
        length: 8,
        offset: 14,
      },
    ],
    place_id: "ChIJkZL34OQt3YkRYuJIK-VWc4w",
    reference: "ChIJkZL34OQt3YkRYuJIK-VWc4w",
    structured_formatting: {
      main_text: "754 Broadway",
      main_text_matched_substrings: [
        {
          length: 3,
          offset: 0,
        },
        {
          length: 8,
          offset: 4,
        },
      ],
      secondary_text: "Newburgh, NY, USA",
      secondary_text_matched_substrings: [
        {
          length: 8,
          offset: 0,
        },
      ],
    },
    terms: [
      {
        offset: 0,
        value: "754",
      },
      {
        offset: 4,
        value: "Broadway",
      },
      {
        offset: 14,
        value: "Newburgh",
      },
      {
        offset: 24,
        value: "NY",
      },
      {
        offset: 28,
        value: "USA",
      },
    ],
    types: ["geocode", "premise"],
  },
];

export const placeDetailsCallbackArg = {
  adr_address:
    '<span class="street-address">754 Broadway</span>, <span class="locality">Newburgh</span>, <span class="region">NY</span> <span class="postal-code">12550-6506</span>, <span class="country-name">USA</span>',
  formatted_address: "754 Broadway, Newburgh, NY 12550, USA",
  geometry: {
    location: {
      lat: 41.5025289,
      lng: -74.043393,
    },
  },
  name: "754 Broadway",
  place_id: "ChIJkZL34OQt3YkRYuJIK-VWc4w",
  html_attributions: [],
};
