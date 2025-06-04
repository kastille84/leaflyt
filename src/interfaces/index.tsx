export interface LatLng
  extends Omit<
    GeolocationCoordinates,
    | "altitude"
    | "accuracy"
    | "altitudeAccuracy"
    | "heading"
    | "speed"
    | "toJSON"
  > {}

export interface NearbySearchPlaceResult {
  id: string;
  formattedAddress: string;
  displayName: {
    text: string;
    languageCode: string;
  };
  location: {
    latitude: number;
    longitude: number;
  };
  plusCode: {
    compoundCode: string;
    globalCode: string;
  };
}
