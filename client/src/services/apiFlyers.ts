import { supabase } from "./supabase";
import { createBoard, getBoard } from "./apiBoards";
import {
  DB_Flyers_Create_Unregistered,
  DB_Flyer_Create,
  DB_Template,
  DB_Flyers_Response,
} from "../interfaces/DB_Flyers";
import { NearbySearchPlaceResult } from "../interfaces/Geo";
import { Auth_User_Profile_Response } from "../interfaces/Auth_User";
import { getUserProfile } from "./apiUser";
import { UploadApiResponse } from "cloudinary";
import { assetUsageByFlyer, assetUsageByTemplate } from "./apiAssets";
import { getBaseUrl } from "../utils/ServiceUtils";
import { checkFlyerDataForAppropriateness } from "../utils/FlyerUtils";

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
  // make sure content is appropriate
  await moderateContent(flyerData);
  const board = await getOrCreateBoard(selectedPlace);
  // at this point, board is either the existing board or the newly created board with flyers array that may be empty
  // create the flyer
  try {
    const { data: newFlyer, error } = await supabase
      .from("flyers")
      .insert([{ ...flyerData, place: selectedPlace.id, likes: 0 }]) // selectedPlace.id is the placeId of the board
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
  // make sure content is appropriate
  await moderateContent(flyerData);

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
            likes: 0,
          },
        ])
        .select("*")
        .single();
      if (error) {
        console.error(error);
        throw new Error("Error creating a template: " + error.message);
      }
      createdTemplate = newTemplate;
      // keep track of assets being used in templates
      await assetUsageByTemplate(
        [],
        flyerData.fileUrlArr || [],
        newTemplate.id
      );
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
          likes: 0,
        },
      ])
      .select("*")
      .single();

    if (error) {
      console.error(error);
      throw new Error("Error creating a flyer: " + error.message);
    }

    // keep track of assets being used in flyers
    await assetUsageByFlyer([], flyerData.fileUrlArr || [], newFlyer.id);

    // return updated user
    return await getLatestUserAfterChanges(newFlyer?.user! as string, "flyer");
  } catch (error: any) {
    console.error(error);
    throw new Error("Error creating a flyer: " + error.message);
  }
};
export const updateRegisteredFlyer = async (
  flyerData: DB_Flyer_Create,
  selectedPlace: NearbySearchPlaceResult,
  initialAssets: UploadApiResponse[]
) => {
  // make sure content is appropriate
  await moderateContent(flyerData);

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

    if (error) {
      console.error(error);
      throw new Error("Error updating the flyer: " + error.message);
    }

    // keep track of assets being used in flyers
    await assetUsageByFlyer(
      initialAssets,
      flyerData.fileUrlArr || [],
      updatedFlyer.id
    );

    return await getLatestUserAfterChanges(
      updatedFlyer?.user as string,
      "flyer"
    );
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
  // make sure content is appropriate
  await moderateContent(templateData);

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
    likes: 0,
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
  } else {
    flyerData.postingMethod = "onLocation";
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

    // keep track of assets being used in flyers
    await assetUsageByFlyer([], flyerData.fileUrlArr || [], newFlyer.id);

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

export const deleteFlyer = async (flyer: DB_Flyers_Response) => {
  try {
    const { error } = await supabase.from("flyers").delete().eq("id", flyer.id);
    // keep track of assets being used in flyers
    await assetUsageByFlyer(flyer.fileUrlArr || [], [], flyer.id!);
    // return updated user
    return await getLatestUserAfterChanges(
      (flyer?.user as Auth_User_Profile_Response).id as string,
      "flyer"
    );
  } catch (error: any) {
    console.error(error);
    throw new Error("Error deleting the flyer: " + error.message);
  }
};

export const updateTemplate = async (
  templateData: DB_Template,
  initialAssets: UploadApiResponse[]
) => {
  // make sure content is appropriate
  await moderateContent(templateData);

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

    // keep track of assets being used in templates
    await assetUsageByTemplate(
      initialAssets,
      templateData.fileUrlArr || [],
      templateData.id as string
    );
    // return updated user
    return await getLatestUserAfterChanges(
      templateData?.user! as string,
      "template"
    );
    // const { data: userData, error: getUserError } = await getUserProfile(
    //   templateData?.user! as number
    // );
    // if (getUserError) {
    //   console.error(getUserError);
    //   throw new Error("Error updating the template: " + getUserError);
    // }
    // return {
    //   user: userData,
    //   error: null,
    // };
  } catch (error: any) {
    console.error(error);
    throw new Error("Error updating the template: " + error.message);
  }
};

export const createTemplate = async (templateData: DB_Template) => {
  // make sure content is appropriate
  await moderateContent(templateData);
  try {
    const { data: newTemplate, error } = await supabase
      .from("templates")
      .insert([
        {
          user: templateData.user,
          templateName: templateData.templateName,
          title: templateData.title,
          category: templateData.category,
          subcategory: templateData.subcategory,
          content: templateData.content,
          tags: templateData.tags,
          flyerDesign: templateData.flyerDesign,
          callToAction: templateData.callToAction,
          fileUrlArr: templateData.fileUrlArr,
          hasComments: templateData.hasComments,
          lifespan: templateData.lifespan,
          likes: 0,
        },
      ])
      .select("*")
      .single();
    if (error) {
      console.error(error);
      throw new Error("Error creating a template: " + error.message);
    }

    // keep track of assets being used in templates
    await assetUsageByTemplate(
      [],
      templateData.fileUrlArr || [],
      newTemplate.id
    );
    // return updated user
    return await getLatestUserAfterChanges(
      templateData?.user! as string,
      "template"
    );
    // const { data: userData, error: getUserError } = await getUserProfile(
    //   templateData?.user! as number
    // );
    // if (getUserError) {
    //   console.error(getUserError);
    //   throw new Error("Error updating the template: " + getUserError);
    // }
    // return {
    //   user: userData,
    //   error: null,
    // };
  } catch (error: any) {
    console.error(error);
    throw new Error("Error creating a template: " + error.message);
  }
};

// #TODO: AI generated, must check this code and consider effects on templates?
export const deleteTemplate = async (template: DB_Template) => {
  try {
    const { error } = await supabase
      .from("templates")
      .delete()
      .eq("id", template.id);
    if (error) {
      console.error(error);
      throw new Error("Error deleting the template: " + error.message);
    }
    // keep track of assets being used in templates
    await assetUsageByTemplate(
      template.fileUrlArr || [],
      [],
      template.id as string
    );
    // return updated user
    return await getLatestUserAfterChanges(
      (template?.user as Auth_User_Profile_Response)?.id! as string,
      "template"
    );
  } catch (error: any) {
    console.error(error);
    throw new Error("Error deleting the template: " + error.message);
  }
};

export const saveFlyer = async (userId: number | string, flyerId: string) => {
  try {
    const { error } = await supabase.from("saved_flyers").insert([
      {
        user: userId,
        flyer: flyerId,
      },
    ]);
    if (error) {
      console.error(error);
      throw new Error("Error saving the flyer: " + error.message);
    }
    // return updated user
    return await getLatestUserAfterChanges(userId as string, "saved flyer");
  } catch (error: any) {
    console.error(error);
    throw new Error("Error saving the flyer: " + error.message);
  }
};

export const removeSavedFlyer = async (
  userId: number | string,
  flyerId: number | string
) => {
  try {
    const { error } = await supabase
      .from("saved_flyers")
      .delete()
      .eq(typeof flyerId === "string" ? "flyer" : "id", flyerId);
    if (error) {
      console.error(error);
      throw new Error("Error removing the saved flyer: " + error.message);
    }
    // return updated user
    return await getLatestUserAfterChanges(userId as string, "saved flyer");
  } catch (error: any) {
    console.error(error);
    throw new Error("Error removing the saved flyer: " + error.message);
  }
};

export const likeFlyer = async (
  flyer: DB_Flyers_Response,
  type: "inc" | "dec"
) => {
  try {
    if (flyer.template) {
      // update both flyer and template
      const { data, error } = await supabase.rpc("increment_likes_combined", {
        flyer_id_val: flyer.id, // Argument for the flyers table ID
        template_id_val: flyer.template, // Argument for the templates table ID,
        amount: type === "inc" ? 1 : -1,
      });

      return {
        newLikes: data,
        error: null,
      };
    } else {
      // just update flyer
      const { data, error } = await supabase.rpc("increment_likes_for_flyer", {
        flyer_id_val: flyer.id, // Argument for the flyers table ID
        amount: type === "inc" ? 1 : -1,
      });
      return {
        newLikes: data,
        error: null,
      };
    }
  } catch (error: any) {
    console.error(error);
    throw new Error("Error liking the flyer: " + error.message);
  }
};

//  REUSABLE UTILITY CALLS
export async function getLatestUserAfterChanges(userId: string, type: string) {
  // return updated user
  const { data: userData, error: getUserError } = await getUserProfile(userId);
  if (getUserError) {
    console.error(getUserError);
    throw new Error(`Error updating the ${type}: ` + getUserError);
  }
  return {
    user: userData,
    error: null,
  };
}

export async function moderateContent(
  flyerData: DB_Flyer_Create | DB_Template
) {
  const { messageToCheck, fileUrlsToCheck } =
    checkFlyerDataForAppropriateness(flyerData);
  try {
    const response = await fetch(`${getBaseUrl()}/api/moderate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: messageToCheck,
        fileUrls: fileUrlsToCheck,
      }),
    });
    const result = await response.json();

    if (result.data.results[0].flagged) {
      throw new Error(
        "Flagged content and/or image. Please abide by our guidelines. If you feel this is an error, please contact us. (leaflit.flyers@gmail.com) "
      );
    }
  } catch (error: any) {
    console.error(error);
    throw new Error("Error Checking Content: " + error.message);
  }

  return true;
}
