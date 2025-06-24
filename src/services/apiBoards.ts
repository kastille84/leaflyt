import { PostgrestError } from "@supabase/supabase-js";
import { DB_Board } from "../interfaces/DB_Board";
import { supabase } from "./supabase";

export const getBoards = async () => {
  const { data, error } = await supabase.from("boards").select("*");
  return { data, error };
};

export const getBoard = async (
  placeId: string
): Promise<{
  data: DB_Board | any[] | null;
  error: PostgrestError | null;
}> => {
  const { data, error } = await supabase
    .from("boards")
    .select("*")
    .eq("placeId", placeId)
    .single();
  return { data, error };
};

export const createBoard = async (
  selectedPlace: DB_Board
): Promise<{
  data: DB_Board | any[] | null;
  error: PostgrestError | null;
}> => {
  const { data, error } = await supabase
    .from("boards")
    .insert([selectedPlace])
    .select()
    .single();
  return { data, error };
};
