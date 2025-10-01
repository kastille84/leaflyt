import { getBaseUrl } from "../utils/ServiceUtils";
import { supabase } from "./supabase";

export const addAsset = async (asset: any, id: number) => {
  try {
    const { data, error } = await supabase
      .from("assets")
      .insert([{ asset_info: asset, user: id }])
      .single();
    if (error) throw error;
    return data;
  } catch (error) {
    return { data: null, error };
  }
};
