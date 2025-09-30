import { UploadApiResponse } from "cloudinary";
import { Auth_User_Profile_Response } from "./Auth_User";
import { DB_Board } from "./DB_Board";

export type PlaceInfo = {
  displayName: string;
  formattedAddress: string;
  location: {
    lat: number;
    lng: number;
  };
  tags: string[];
};

export interface FlyerDesign {
  top: {
    backgroundColor: string;
    color: string;
  };
  outlines: {
    color: string;
  };
  font: string;
  title: {
    color: string;
  };
  subcategory: {
    color: string;
  };
  readMore: {
    color: string;
  };
  tags: {
    color: string;
  };
  borderTopLeftRadius: number;
  borderTopRightRadius: number;
  borderBottomLeftRadius: number;
  borderBottomRightRadius: number;
}

export interface DB_Flyer_Create {
  id?: string;
  user?: string | Auth_User_Profile_Response | number;
  // boardId?: string;
  place?: string | DB_Board;
  title: string;
  category: string;
  subcategory: string;
  content: string;
  tags?: string[];
  fileUrlArr?: UploadApiResponse[];
  postingMethod?: "onLocation" | "remote" | "remoteBulk";
  flyerDesign?: null | FlyerDesign;
  callToAction?: {
    ctaType: "offer" | "ask" | "none";
    headline: string;
    instructions: string;
  };
  lifespan?: string;
  template?: string | null;
  templateName?: string;
  hasComments?: boolean;
  placeInfo?: PlaceInfo;
}

interface DB_Flyer_Create_Unregistered extends DB_Flyer_Create {
  typeOfUser: "individual" | "business" | "organization" | "anonymous";
}

export interface DB_Flyer_Create_Unregistered_Anonymous
  extends DB_Flyer_Create_Unregistered {
  attestation: boolean;
}
export interface DB_Flyer_Create_Unregistered_Individual
  extends DB_Flyer_Create_Unregistered {
  individual: {
    name: {
      firstName: string;
      lastName: string;
    };
    contact: {
      email: string;
      phone: string;
      website: string;
    };
  };
}
export interface DB_Flyer_Create_Unregistered_Business
  extends DB_Flyer_Create_Unregistered {
  business: {
    name: string;
    contact: {
      address: string;
      email: string;
      phone: string;
      website: string;
    };
  };
}
export interface DB_Flyer_Create_Unregistered_Organization
  extends DB_Flyer_Create_Unregistered {
  organization: {
    name: string;
    contact: {
      address: string;
      email: string;
      phone: string;
      website: string;
    };
  };
}

export type DB_Flyers_Create_Unregistered =
  | DB_Flyer_Create_Unregistered_Anonymous
  | DB_Flyer_Create_Unregistered_Individual
  | DB_Flyer_Create_Unregistered_Business
  | DB_Flyer_Create_Unregistered_Organization;

export type DB_Flyers_Response = DB_Flyers_Create_Unregistered;

// export interface DB_Template {
//   id: string;
//   user: string | Auth_User_Profile_Response;
//   templateName: string;
//   title: string;
//   category: string;
//   subcategory: string;
//   content: string;
//   tags: string[];
//   flyerDesign: FlyerDesign;
//   callToAction: flyerData.callToAction;
//   fileUrlArr: flyerData.fileUrlArr;
//   hasComments: flyerData.hasComments;
// }

interface RemoveFlyerKeys {
  id: string;
  place: string;
  postingMethod?: "onLocation" | "remote" | "remoteBulk";
  placeInfo?: PlaceInfo;
}
export interface DB_Template
  extends Omit<DB_Flyer_Create, keyof RemoveFlyerKeys> {
  id: string;
}
