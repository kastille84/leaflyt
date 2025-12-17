import { getBaseUrl } from "../utils/ServiceUtils";
import { supabase } from "./supabase";

export const getUserProfile = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select(
        `*,
          flyers(*, place(*)),
          templates(*, user(*)),
          plan(*),
          assets(*),
          saved_flyers(*, flyer(*, place(*), user(*)))
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
