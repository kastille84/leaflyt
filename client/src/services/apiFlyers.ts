import { supabase } from "./supabase";
import { createBoard, getBoard } from "./apiBoards";
import {
  DB_Flyers_Create_Unregistered,
  DB_Flyer_Create,
  DB_Template,
} from "../interfaces/DB_Flyers";
import { NearbySearchPlaceResult } from "../interfaces/Geo";
import { Auth_User_Profile_Response } from "../interfaces/Auth_User";
import { getUserProfile } from "./apiUser";

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
            lifespan: flyerData.lifespan,
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
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const pt = urlParams.get("pt");
    // posting type
    if (pt) {
      switch (pt) {
        case "r":
          flyerData.postingMethod = "remote";
          break;
        case "rb":
          flyerData.postingMethod = "remoteBulk";
          break;
        default:
          flyerData.postingMethod = "onLocation";
      }
    }
    const { data: newFlyer, error } = await supabase
      .from("flyers")
      .insert([
        {
          template: createdTemplate?.id, // many to one with template table
          place: selectedPlace.id, // many to one with board table
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
export const updateRegisteredFlyer = async (
  flyerData: DB_Flyer_Create,
  selectedPlace: NearbySearchPlaceResult
) => {
  const board = await getOrCreateBoard(selectedPlace);

  // Flyer is made to be Stand-alone, if once belonging to a template, remove reference
  flyerData.template = null;
  // create the flyer and attach the template id
  try {
    const { data: updatedFlyer, error } = await supabase
      .from("flyers")
      .update(flyerData)
      .eq("id", flyerData.id)
      .select("*")
      .single();
    // const { data: newFlyer, error } = await supabase
    //   .from("flyers")
    //   .insert([
    //     {
    //       template: createdTemplate?.id, // many to one with template table
    //       place: selectedPlace.id, // many to one with board table
    //       user: flyerData.user,
    //       title: flyerData.title,
    //       category: flyerData.category,
    //       subcategory: flyerData.subcategory,
    //       content: flyerData.content,
    //       tags: flyerData.tags,
    //       flyerDesign: flyerData.flyerDesign,
    //       callToAction: flyerData.callToAction,
    //       fileUrlArr: flyerData.fileUrlArr,
    //       postingMethod: flyerData.postingMethod || "onLocation",
    //       lifespan: flyerData.lifespan,
    //     },
    //   ])
    //   .select("*")
    //   .single();

    if (error) {
      console.error(error);
      throw new Error("Error updating the flyer: " + error.message);
    }
    return updatedFlyer;
  } catch (error: any) {
    console.error(error);
    throw new Error("Error updating the flyer: " + error.message);
  }
};

export const createFlyerFromTemplate = async (
  templateData: DB_Template,
  selectedPlace: NearbySearchPlaceResult,
  user: Auth_User_Profile_Response
) => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const pt = urlParams.get("pt");
  const board = await getOrCreateBoard(selectedPlace);

  const flyerData: DB_Flyer_Create & {
    typeOfUser: string;
    created_at?: string;
  } = {
    ...templateData,
    typeOfUser: user.typeOfUser,
    place: selectedPlace.id,
    user: user.id,
    template: templateData.id,
    // placeInfo: {
    //   displayName: selectedPlace.displayName.text,
    //   formattedAddress: selectedPlace.formattedAddress,
    //   location: {
    //     lat: selectedPlace.location.latitude,
    //     lng: selectedPlace.location.longitude,
    //   },
    //   tags: selectedPlace.types,
    // },
  };

  delete flyerData.id;
  delete flyerData.hasComments;
  delete flyerData.templateName;
  delete flyerData.created_at;
  // posting type
  if (pt) {
    switch (pt) {
      case "r":
        flyerData.postingMethod = "remote";
        break;
      case "rb":
        flyerData.postingMethod = "remoteBulk";
        break;
      default:
        flyerData.postingMethod = "onLocation";
    }
  }

  try {
    const { data: newFlyer, error } = await supabase
      .from("flyers")
      .insert([flyerData])
      .select("*")
      .single();

    if (error) {
      console.error(error);
      throw new Error("Error creating a flyer: " + error.message);
    }

    // tie newFlyer to template
    // await supabase
    //   .from("templates")
    //   .update({ flyer: newFlyer.id })
    //   .eq("id", templateData.template);

    // return updated User with included new flyer
    // const user = await getUser();
    return newFlyer;
  } catch (error: any) {
    console.error(error);
    throw new Error("Error creating a flyer: " + error.message);
  }
};

// #TODO: AI generated, must check this code and consider effects on templates?
export const deleteFlyer = async (flyerId: number) => {
  try {
    const { error } = await supabase.from("flyers").delete().eq("id", flyerId);
    if (error) {
      console.error(error);
      throw new Error("Error deleting the flyer: " + error.message);
    }
  } catch (error: any) {
    console.error(error);
    throw new Error("Error deleting the flyer: " + error.message);
  }
};

export const updateTemplate = async (templateData: DB_Template) => {
  try {
    const { error } = await supabase
      .from("templates")
      .update(templateData)
      .eq("id", templateData.id);
    if (error) {
      console.error(error);
      throw new Error("Error updating the template: " + error.message);
    }
    // update all existing flyers that use this template
    const { error: updateFlyersError } = await supabase
      .from("flyers")
      .update({
        title: templateData.title,
        category: templateData.category,
        subcategory: templateData.subcategory,
        content: templateData.content,
        tags: templateData.tags,
        flyerDesign: templateData.flyerDesign,
        callToAction: templateData.callToAction,
        fileUrlArr: templateData.fileUrlArr,
        lifespan: templateData.lifespan,
      })
      .eq("template", templateData.id);

    if (updateFlyersError) {
      console.error(updateFlyersError);
      throw new Error(
        "Error updating all flyers belonging to the template: " +
          updateFlyersError.message
      );
    }
    // return updated user
    const { data: user, error: userError } = await getUserProfile(
      templateData?.user! as number
    );
    if (userError) {
      console.error(userError);
      throw new Error(
        "Error reflecting the latest changes, please refresh the page: " +
          userError.message
      );
    }
    return {
      data: user,
      error: null,
    };
  } catch (error: any) {
    console.error(error);
    throw new Error("Error updating the template: " + error.message);
  }
};
