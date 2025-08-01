import { UploadApiResponse } from "cloudinary";

interface DB_Flyer_Create {
  id?: string;
  userId?: string;
  // boardId?: string;
  placeId?: string;
  title: string;
  category: string;
  subcategory: string;
  content: string;
  tags?: string[];
  fileUrlArr?: UploadApiResponse[];
  postingMethod: "onLocation" | "remote" | "remoteBulk";
}

interface DB_Flyer_Create_Unregistered extends DB_Flyer_Create {
  typeOfUser: string;
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
