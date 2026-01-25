import { Auth_User_Profile_Response } from "../interfaces/Auth_User";
import {
  DB_Flyer_Create,
  DB_Flyers_Response,
  DB_Saved_Flyer,
  DB_Template,
} from "../interfaces/DB_Flyers";

export const groupFlyersToTemplates = (
  user: Auth_User_Profile_Response | null
) => {
  const groupedFlyers: any = {};
  user?.flyers.forEach((flyer: any) => {
    if (groupedFlyers[flyer.template]) {
      groupedFlyers[flyer.template].push(flyer);
    } else {
      groupedFlyers[flyer.template] = [flyer];
    }
  });
  return groupedFlyers;
};

// check saved_flyers arr to see if current flyer has already been saved
export const checkIfCurrentFlyerIsSaved = (
  saved_flyers: DB_Saved_Flyer[],
  currentFlyer: DB_Flyers_Response
) => {
  return saved_flyers.some((saved_flyer) => {
    return saved_flyer.flyer.id === currentFlyer.id;
  });
};

export const checkIfCurrentFlyerIsLiked = (
  likedFlyers: string[],
  currentFlyerId: string
) => {
  return likedFlyers.some((likedFlyerId) => {
    return likedFlyerId === currentFlyerId;
  });
};

export const groupFlyersBasedOnPostingMethod = (
  flyers: DB_Flyers_Response[]
) => {
  const groupedFlyers: any = {};
  flyers.forEach((flyer: any) => {
    if (groupedFlyers[flyer.postingMethod]) {
      groupedFlyers[flyer.postingMethod].push(flyer);
    } else {
      groupedFlyers[flyer.postingMethod] = [flyer];
    }
  });
  return groupedFlyers;
};

export const totalNumberOfFlyerLikes = (flyers: DB_Flyers_Response[]) => {
  let totalLikes = 0;
  flyers.forEach((flyer: any) => {
    totalLikes += flyer.likes;
  });
  return totalLikes;
};

export const prepFlyerDataForAppropriateness = (
  flyerData: DB_Flyer_Create | DB_Template
) => {
  // first check if content is appropriate
  let messageToCheck = `\n${flyerData.title}\n${flyerData.content}`;
  if (flyerData.callToAction)
    messageToCheck += `\n${flyerData.callToAction.headline}\n${flyerData.callToAction.instructions}`;
  // map the flyerData.fileUrlArr to an array of urls
  let fileUrlsToCheck: any[] = [];
  if (flyerData.fileUrlArr && flyerData.fileUrlArr.length > 0) {
    flyerData.fileUrlArr.forEach((fileUrl) => {
      if (fileUrl.resource_type === "image") {
        fileUrlsToCheck.push({
          image_url: { url: fileUrl.url },
          type: "image_url",
        });
      }
    });
  }
  return { messageToCheck, fileUrlsToCheck };
};
