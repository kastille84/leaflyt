import { SignupSubmitData } from "../interfaces/Auth_User";
import { getBaseUrl } from "../utils/ServiceUtils";
import { supabase } from "./supabase";

export const loginUser = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      throw error;
    }

    // store the access token in local storage
    // localStorage.setItem(
    //   "access_token",
    //   JSON.stringify(data.session?.access_token)
    // );
    // supabase.auth.getUser(data.session?.access_token).then((user) => {
    //   console.log("user", user);
    // });
    // get userProfile from supabase
    const { data: userProfile, error: userProfileError } = await supabase
      .from("profiles")
      .select(
        `*,
        flyers(*, place(*)),
        templates(*, user(*)),
        plan(*),
        assets(*),
        saved_flyers(*, flyer(*, place(*), user(*)))
        `
      )
      .eq("email", email)
      .single();
    console.log("userProfile", userProfile);
    if (userProfileError) {
      throw userProfileError;
    }
    return {
      data: userProfile,
      error: null,
    };
  } catch (error) {
    return { data: null, error };
  }
};

export const loginUserWithAccessToken = async () => {
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error) {
      throw error;
    }
    const { data: userProfile, error: userProfileError } = await supabase
      .from("profiles")
      .select(
        `*,
        flyers(*, place(*)),
        templates(*, user(*)),
        plan(*),
        assets(*),
        saved_flyers(*, flyer(*, place(*), user(*)))
        `
      )
      .eq("email", data.user.email)
      .single();
    console.log("userProfile", userProfile);
    if (userProfileError) {
      throw new Error("Could not fetch user profile");
    }
    return {
      data: userProfile,
      error: null,
    };
  } catch (error) {
    return { data: null, error };
  }
};
export const signupUser = async (prepData: SignupSubmitData) => {
  prepData.type = prepData.typeOfUser;
  let dataForAuthSignup;
  let contact;
  let name;
  switch (prepData.type) {
    case "individual":
      dataForAuthSignup = {
        email: prepData.individual.contact.email,
        password: prepData.password,
      };
      contact = prepData.individual.contact;
      name = prepData.individual.name;
      break;
    case "business":
      dataForAuthSignup = {
        email: prepData.business.contact.email,
        password: prepData.password,
      };
      contact = prepData.business.contact;
      name = prepData.business.name;
      break;
    case "organization":
      dataForAuthSignup = {
        email: prepData.organization.contact.email,
        password: prepData.password,
      };
      contact = prepData.organization.contact;
      name = prepData.organization.name;
      break;
  }

  try {
    // create auth user in  supabase
    const { data, error } = await supabase.auth.signUp({
      ...dataForAuthSignup,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard/home`,
      },
    });
    console.log("auth.signup", data);
    if (error) throw error;
    // //  create user profile in supabase
    const newUser = {
      name: typeof name === "string" ? name : null,
      firstName: typeof name === "object" ? name.firstName : null,
      lastName: typeof name === "object" ? name.lastName : null,
      email: contact.email,
      phone: contact.phone,
      website: contact.website,
      address: prepData.addressObjToSave,
      typeOfUser: prepData.typeOfUser,
      user: data.user?.id,
    };

    const response = await fetch(`${getBaseUrl()}/api/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newUser),
    });
    const result = await response.json();
    console.log("result", result);
    return result;
  } catch (error) {
    return { data: null, error };
  }
};

// export const getUser = async () => {
//   try {
//     const { data, error } = await supabase.auth.getUser();
//     if (error) {
//       throw error;
//     }
//     const { data: userProfile, error: userProfileError } = await supabase
//       .from("profiles")
//       .select("*")
//       .eq("email", data.user.email)
//       .single();
//     if (userProfileError) {
//       throw new Error("Could not fetch user profile");
//     }
//     return {
//       data: userProfile,
//       error: null,
//     };
//   } catch (error) {
//     return { data: null, error };
//   }
// };
// export const getUserWithFlyersAndTemplates = async () => {
//     const { data, error } = await supabase
//     .from('users') // Start by querying the users table
//     .select(`
//       *, // Select all columns from the user record
//       flyers ( * ), // Select all columns from the related flyers
//       templates ( * ) // Select all columns from the related templates
//     `)
//     .eq('id', userId); // Filter for the specific user ID

//   if (error) {
//     console.error('Error fetching user data:', error.message);
//     return null;
//   }

//   return data; // 'data' will be an array containing the user record(s) with embedded flyers and templates
// };
