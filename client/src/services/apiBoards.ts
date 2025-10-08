import { PostgrestError } from "@supabase/supabase-js";
import { DB_Board, DB_Board_Response } from "../interfaces/DB_Board";
import { supabase } from "./supabase";
import { DB_Flyers_Response } from "../interfaces/DB_Flyers";
import { Auth_User_Profile_Response } from "../interfaces/Auth_User";

export const getBoards = async () => {
  const { data, error } = await supabase.from("boards").select("*");
  return { data, error };
};

export const getBoard = async (
  placeId: string,
  profileId?: number
): Promise<{
  data: DB_Board_Response | null;
  error: PostgrestError | null;
}> => {
  let foundUserFlyer = null;
  if (profileId) {
    const { data: foundUser } = await supabase
      .from("flyers")
      .select("*")
      .eq("place", placeId)
      .eq("user", profileId)
      .single();
    foundUserFlyer = foundUser;
  }

  const { data, error } = await supabase
    .from("boards")
    .select(
      `*,
        flyers(*, user(id, firstName, lastName, name, email, phone, website, address))`
    )
    .eq("placeId", placeId)
    .order("created_at", {
      referencedTable: "flyers",
      ascending: false,
      nullsFirst: false,
    })
    .single();

  return {
    data: data ? { ...data, hasFlyerHere: !!foundUserFlyer } : {},
    error,
  };
};

export const createBoard = async (
  selectedPlace: DB_Board
): Promise<{
  data: DB_Board_Response | null;
  error: PostgrestError | null;
}> => {
  const { data, error } = await supabase
    .from("boards")
    .insert([selectedPlace])
    .select()
    .single();
  return { data, error };
};
