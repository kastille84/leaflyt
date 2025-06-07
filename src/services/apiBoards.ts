import { PostgrestError } from "@supabase/supabase-js";
import { DB_Board } from "../interfaces/DB_Board";
import { supabase } from "./supabase";

export const getBoards = async () => {
  const { data, error } = await supabase.from("boards").select("*");
  return { data, error };
};

export const getBoard = async (
  id: string
): Promise<{
  data: DB_Board | null;
  error: PostgrestError | null;
}> => {
  const { data, error } = await supabase
    .from("boards")
    .select("*")
    .eq("placeId", id)
    .single();
  return { data, error };
};
