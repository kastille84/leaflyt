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

export const deleteAssets = async (assets: any, id: number) => {
  // #TODO:
  //  api call to delete assets
  try {
    const response = await fetch(`${getBaseUrl()}/api/assets/delete`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        assets: JSON.stringify(assets),
        user: JSON.stringify(id),
      },
    });
    const result = await response.json();
    console.log("result", result);
    return result;
  } catch (error) {}
};
