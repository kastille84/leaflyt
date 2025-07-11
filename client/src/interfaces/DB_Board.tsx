import { DB_Flyers_Response } from "./DB_Flyers";
import { LatLng } from "./Geo";

export interface DB_Board {
  id?: string;
  placeId: string;
  name: string;
  formattedAddress: string;
  latlng: LatLng;
  tags: string[];
  flyers: string[];
  created_at?: Date;
}
export interface DB_Board_Response {
  id?: string;
  placeId: string;
  name: string;
  formattedAddress: string;
  latlng: LatLng;
  tags: string[];
  flyers: DB_Flyers_Response[];
  created_at?: Date;
}

export interface DB_Board_Error {
  code: string;
  details: string;
  hint: string | null;
  message: string;
}
