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
  email: string;
  password: string;
}

export interface UserProfile {
  id: string;
}
