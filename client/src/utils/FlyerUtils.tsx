import { Auth_User_Profile_Response } from "../interfaces/Auth_User";
import { DB_Flyers_Response, DB_Saved_Flyer } from "../interfaces/DB_Flyers";

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
