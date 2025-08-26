import { DB_Template } from "./DB_Flyers";
import { Plan } from "./Plan";

interface Individual {
  type: "individual";
  individual: {
    name: {
      firstName: string;
      lastName: string;
    };
    contact: {
      phone: string;
      address: string | AddressToSave;
      website?: string;
      email: string;
    };
  };
}

interface Business {
  type: "business";
  business: {
    name: string;
    contact: {
      phone: string;
      address: string | AddressToSave;
      website?: string;
      email: string;
    };
  };
}

interface Organization {
  type: "organization";
  organization: {
    name: string;
    contact: {
      phone: string;
      address: string | AddressToSave;
      website?: string;
      email: string;
    };
  };
}

// type SelecteduserType = Individual | Business | Organization;

type AddressToSave = {
  formatted_address: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  name: string;
  place_id: string;
  // html_attributions: [],
};

interface BaseSignupSubmitData {
  typeOfUser: "individual" | "business" | "organization";
  password: string;
  addressObjToSave: AddressToSave;
}

export type SignupSubmitData = BaseSignupSubmitData &
  (Individual | Business | Organization);

export interface Auth_User_Signup_Response {
  id: string;
  aud: string;
  role: string;
  email: string;
  phone: string;
  confirmation_sent_at: string;
  app_metadata: {
    provider: string;
    providers: string[];
  };
  user_metadata: {
    email: string;
    email_verified: boolean;
    phone_verified: boolean;
    sub: string;
  };
  identities: [
    {
      identity_id: string;
      id: string;
      user_id: string;
      identity_data: {
        email: string;
        email_verified: boolean;
        phone_verified: boolean;
        sub: string;
      };
      provider: string;
      last_sign_in_at: string;
      created_at: string;
      updated_at: string;
      email: string;
    }
  ];
  created_at: string;
  updated_at: string;
  is_anonymous: boolean;
}

export interface Auth_User_Profile_Response {
  id: number;
  created_at: string;
  user: string;
  name: string | null;
  firstName: string | null;
  lastName: string | null;
  email: string;
  phone: string;
  website: string;
  typeOfUser: string;
  plan: Plan;
  address: {
    name: string;
    geometry: {
      location: {
        lat: number;
        lng: number;
      };
    };
    place_id: string;
    adr_address: string;
    formatted_address: string;
    html_attributions: [];
  };
  avatar?: string;
  flyers: any[]; // TODO: add flyer type
  templates: DB_Template[];
}

export interface LoginSubmitData {
  email: string;
  password: string;
}
