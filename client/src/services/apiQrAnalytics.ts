import { supabase } from "./supabase";
import { NearbySearchPlaceResult } from "../interfaces/Geo";
import dayjs from "dayjs";

export const logQrScan = async (place: NearbySearchPlaceResult) => {
  try {
    const { data, error } = await supabase.from("qr_analytics").insert({
      placeId: place.id,
      name: place.displayName.text,
      formattedAddress: place.formattedAddress,
      // format the scan date to be to show day of the week i.e Monday, Tuesday, etc
      scanDate: dayjs().format("dddd, MMMM D, YYYY h:mm:ss A"),
    });
    if (error) throw error;
    return data;
  } catch (error) {
    return { data: null, error };
  }
};
