import { getBaseUrl } from "../utils/ServiceUtils";
import { getLatestUserAfterChanges } from "./apiFlyers";
import { supabase } from "./supabase";

export const selectEverythingFromProfile = `*,
          flyers(*, place(*)),
          templates(*, user(*)),
          plan(*),
          assets(*),
          saved_flyers(*, flyer(*, place(*), user(*))),
          customers(*)
          `;

export const getUserProfile = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select(selectEverythingFromProfile)
      .eq("id", id)
      .single();
    if (error) throw new Error(error.message) as any;

    return {
      data: data,
      error: null,
    };
  } catch (error) {
    return { data: null, error };
  }
};

export const updateUserProfile = async ({
  profile,
  typeOfUser,
  userId,
}: {
  profile: any;
  typeOfUser: "individual" | "business" | "organization" | string;
  userId: string;
}) => {
  console.log("profile", profile);
  console.log("typeOfUser", typeOfUser);
  let nameObj = {};
  let website = "";
  let phone = "";
  if (typeOfUser === "individual") {
    nameObj = {
      firstName: profile.individual.name.firstName,
      lastName: profile.individual.name.lastName,
    };
    website = profile.individual.contact.website;
    phone = profile.individual.contact.phone;
  } else if (typeOfUser === "business") {
    nameObj = { name: profile.business.name };
    website = profile.business.contact.website;
    phone = profile.business.contact.phone;
  } else if (typeOfUser === "organization") {
    nameObj = { name: profile.organization.name };
    website = profile.organization.contact.website;
    phone = profile.organization.contact.phone;
  }
  try {
    const { data, error } = await supabase
      .from("profiles")
      .update([
        {
          ...nameObj,
          website,
          phone,
        },
      ])
      .eq("id", userId)
      .single();
    if (error) throw error;
    // return updated user
    return await getLatestUserAfterChanges(userId as string, "updated profile");
  } catch (error) {
    return { data: null, error };
  }
};

export const updateUserProfilePlan = async (userId: string, plan: number) => {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .update([
        {
          plan: Number(plan),
        },
      ])
      .eq("id", userId)
      .single();
    // .select(selectEverythingFromProfile)
    // .single();
    if (error) throw error;
    // return updated user
    return await getLatestUserAfterChanges(userId as string, "updated profile");
  } catch (error) {
    return { data: null, error };
  }
};
