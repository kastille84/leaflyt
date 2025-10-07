import { getBaseUrl } from "../utils/ServiceUtils";
import { supabase } from "./supabase";

export const getUserProfile = async (id: number) => {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select(
        `*,
          flyers(*, place(*)),
          templates(*),
          plan(*),
          assets(*)
          `
      )
      .eq("id", id)
      .single();
    if (error) throw error;
    return data;
  } catch (error) {
    return { data: null, error };
  }
};
