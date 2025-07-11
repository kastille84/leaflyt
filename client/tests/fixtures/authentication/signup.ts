export const signupSubmitIndividual = {
  typeOfUser: "individual",
  individual: {
    name: {
      firstName: "Edwin",
      lastName: "Martinez",
    },
    contact: {
      phone: "8454013350",
      address: "754 Broadway, Newburgh, NY, USA",
      website: "http://www.dwm.com",
      email: "kastille84@gmail.com",
    },
  },
  password: "password1",
  addressObjToSave: {
    formatted_address: "94 Rockwell Ave, Middletown, NY 10940, USA",
    geometry: {
      location: {
        lat: 41.46473089999999,
        lng: -74.4143496,
      },
    },
    name: "94 Rockwell Ave",
    place_id: "ChIJTRDBYqIyw4kRU2DOROksomU",
    html_attributions: [],
  },
};

export const signupSubmitBusiness = {
  typeOfUser: "business",
  business: {
    name: "Test Bizness",
    contact: {
      address: "754 Broadway, Newburgh, NY, USA",
      phone: "8454013350",
      website: "http://www.dwm.com",
      email: "kastille84@gmail.com",
    },
  },
  password: "password1",
  addressObjToSave: {
    formatted_address: "94 Rockwell Ave, Middletown, NY 10940, USA",
    geometry: {
      location: {
        lat: 41.46473089999999,
        lng: -74.4143496,
      },
    },
    name: "94 Rockwell Ave",
    place_id: "ChIJTRDBYqIyw4kRU2DOROksomU",
    html_attributions: [],
  },
};

export const signupSubmitOrganization = {
  typeOfUser: "organization",
  organization: {
    name: "Test Org",
    contact: {
      address: "754 Broadway, Newburgh, NY, USA",
      phone: "8454013350",
      website: "http://www.dwm.com",
      email: "kastille84@gmail.com",
    },
  },
  password: "password1",
  addressObjToSave: {
    formatted_address: "94 Rockwell Ave, Middletown, NY 10940, USA",
    geometry: {
      location: {
        lat: 41.46473089999999,
        lng: -74.4143496,
      },
    },
    name: "94 Rockwell Ave",
    place_id: "ChIJTRDBYqIyw4kRU2DOROksomU",
    html_attributions: [],
  },
};

export const signupUserResponse = {
  id: "407749fa-fbac-4141-b8d0-6d8e62403d1b",
  aud: "authenticated",
  role: "authenticated",
  email: "kastille84@gmail.com",
  phone: "",
  confirmation_sent_at: "2025-07-03T17:45:26.842368396Z",
  app_metadata: {
    provider: "email",
    providers: ["email"],
  },
  user_metadata: {
    email: "kastille84@gmail.com",
    email_verified: false,
    phone_verified: false,
    sub: "407749fa-fbac-4141-b8d0-6d8e62403d1b",
  },
  identities: [
    {
      identity_id: "4183575f-de34-42f3-bcf1-42a99173227f",
      id: "407749fa-fbac-4141-b8d0-6d8e62403d1b",
      user_id: "407749fa-fbac-4141-b8d0-6d8e62403d1b",
      identity_data: {
        email: "kastille84@gmail.com",
        email_verified: false,
        phone_verified: false,
        sub: "407749fa-fbac-4141-b8d0-6d8e62403d1b",
      },
      provider: "email",
      last_sign_in_at: "2025-07-03T17:45:26.819031582Z",
      created_at: "2025-07-03T17:45:26.81973Z",
      updated_at: "2025-07-03T17:45:26.81973Z",
      email: "kastille84@gmail.com",
    },
  ],
  created_at: "2025-07-03T17:45:26.781913Z",
  updated_at: "2025-07-03T17:45:27.501182Z",
  is_anonymous: false,
};

const signupUserProfileResponse = {
  id: 4,
  created_at: "2025-07-10T22:25:45.103248+00:00",
  user: "407749fa-fbac-4141-b8d0-6d8e62403d1b",
  name: "Test Bizness",
  firstName: null,
  lastName: null,
  email: "kastille84@gmail.com",
  phone: "8454013350",
  website: "http://www.cnn.com",
  typeOfUser: "business",
  plan: 1,
  address: {
    name: "754 Broadway",
    geometry: {
      location: {
        lat: 41.5025289,
        lng: -74.043393,
      },
    },
    place_id: "ChIJkZL34OQt3YkRYuJIK-VWc4w",
    adr_address:
      '<span class="street-address">754 Broadway</span>, <span class="locality">Newburgh</span>, <span class="region">NY</span> <span class="postal-code">12550-6506</span>, <span class="country-name">USA</span>',
    formatted_address: "754 Broadway, Newburgh, NY 12550, USA",
    html_attributions: [],
  },
};
