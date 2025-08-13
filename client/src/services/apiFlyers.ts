import { supabase } from "./supabase";
import { createBoard, getBoard } from "./apiBoards";
import {
  DB_Flyers_Create_Unregistered,
  DB_Flyer_Create,
} from "../interfaces/DB_Flyers";
import { NearbySearchPlaceResult } from "../interfaces/Geo";

const getOrCreateBoard = async (selectedPlace: NearbySearchPlaceResult) => {
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

  return board;
};

export const createUnregisteredFlyer = async (
  flyerData: DB_Flyer_Create,
  selectedPlace: NearbySearchPlaceResult
) => {
  const board = await getOrCreateBoard(selectedPlace);
  // at this point, board is either the existing board or the newly created board with flyers array that may be empty
  // create the flyer
  try {
    const { data: newFlyer, error } = await supabase
      .from("flyers")
      .insert([{ ...flyerData, placeId: selectedPlace.id }]) // selectedPlace.id is the placeId of the board
      .select("*")
      .single();

    if (error) {
      console.error(error);
      throw new Error("Error creating a flyer: " + error.message);
    }
    return newFlyer;
  } catch (error: any) {
    console.error(error);
    throw new Error("Error creating a flyer: " + error.message);
  }
};

export const createRegisteredFlyer = async (
  flyerData: DB_Flyer_Create,
  selectedPlace: NearbySearchPlaceResult
) => {
  const board = await getOrCreateBoard(selectedPlace);
  let createdTemplate;
  // check if user wants to create template
  if (flyerData.template) {
    // used as a flag for if user wants to create a template. REMOVE reference
    delete flyerData.template;
    // create a template
    try {
      const { data: newTemplate, error } = await supabase
        .from("templates")
        .insert([
          {
            user: flyerData.user,
            templateName: flyerData.templateName,
            title: flyerData.title,
            category: flyerData.category,
            subcategory: flyerData.subcategory,
            content: flyerData.content,
            tags: flyerData.tags,
            flyerDesign: flyerData.flyerDesign,
            callToAction: flyerData.callToAction,
            fileUrlArr: flyerData.fileUrlArr,
            hasComments: flyerData.hasComments,
          },
        ])
        .select("*")
        .single();
      if (error) {
        console.error(error);
        throw new Error("Error creating a template: " + error.message);
      }
      createdTemplate = newTemplate;
    } catch (error: any) {
      console.error(error);
      throw new Error("Error creating a template: " + error.message);
    }
  }
  // create the flyer and attach the template id
  try {
    const { data: newFlyer, error } = await supabase
      .from("flyers")
      .insert([
        {
          template: createdTemplate?.id, // many to one with template table
          placeId: selectedPlace.id, // many to one with board table
          user: flyerData.user,
          title: flyerData.title,
          category: flyerData.category,
          subcategory: flyerData.subcategory,
          content: flyerData.content,
          tags: flyerData.tags,
          flyerDesign: flyerData.flyerDesign,
          callToAction: flyerData.callToAction,
          fileUrlArr: flyerData.fileUrlArr,
          postingMethod: flyerData.postingMethod || "onLocation",
          lifespan: flyerData.lifespan,
        },
      ])
      .select("*")
      .single();

    if (error) {
      console.error(error);
      throw new Error("Error creating a flyer: " + error.message);
    }
    return newFlyer;
  } catch (error: any) {
    console.error(error);
    throw new Error("Error creating a flyer: " + error.message);
  }
};
