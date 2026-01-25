import { supabase } from "./supabase";
export const getPlans = async () => {
  try {
    const { data, error } = await supabase.from("plans").select("*");
    if (error) {
      throw error;
    }
    return { data, error };
  } catch (error) {
    return { data: null, error };
  }
};
