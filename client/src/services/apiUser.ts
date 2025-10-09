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
    if (error) throw new Error(error.message) as any;

    return {
      data: data,
      error: null,
    };
  } catch (error) {
    return { data: null, error };
  }
};
