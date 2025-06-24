import { supabase } from "./supabase";
import { createBoard, getBoard } from "./apiBoards";
import {
  DB_Flyer_Create_Unregistered_Anonymous,
  DB_Flyer_Create_Unregistered_Business,
  DB_Flyer_Create_Unregistered_Individual,
  DB_Flyer_Create_Unregistered_Organization,
} from "../interfaces/DB_Flyers";
import { NearbySearchPlaceResult } from "../interfaces/Geo";
import { DB_Board } from "../interfaces/DB_Board";

export const createUnregisteredFlyer = async (
  flyerData:
    | DB_Flyer_Create_Unregistered_Anonymous
    | DB_Flyer_Create_Unregistered_Individual
    | DB_Flyer_Create_Unregistered_Business
    | DB_Flyer_Create_Unregistered_Organization,
  selectedPlace: NearbySearchPlaceResult
) => {
  // make a call to get the latest board data
  let board = await getBoard(selectedPlace.id);
  let newBoard;
  if (board.error) {
    // the place does not exist in supabase, so we need to create it first
    const boardData = {
      placeId: selectedPlace.id,
      name: selectedPlace.displayName.text,
      formattedAddress: selectedPlace.formattedAddress,
      latlng: selectedPlace.location,
      tags: selectedPlace.types,
      flyers: [],
    };
    try {
      newBoard = await createBoard(boardData);
      console.log("newBoard", newBoard);
      board = newBoard;
    } catch (error) {
      console.error(error);
      throw new Error("Error prepping the board to create a flyer");
    }
  }
  // at this point, board is either the existing board or the newly created board with flyers array that may be empty
  // create the flyer
  try {
    const { data: newFlyer, error } = await supabase
      .from("flyers")
      .insert([{ ...flyerData, placeId: selectedPlace.id }])
      .select("*")
      .single();
    // add the flyer to the board
    await supabase
      .from("boards")
      .update({ flyers: [...(board.data! as DB_Board).flyers, newFlyer] })
      .eq("id", (board.data! as DB_Board).id);

    // if (error) {
    //   console.error(error);
    //   throw new Error("Error creating a flyer: " + error.message);
    // }
  } catch (error: any) {
    console.error(error);
    throw new Error("Error creating a flyer: " + error.message);
  }
};
