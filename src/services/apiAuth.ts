import { SignupSubmitData } from "../interfaces/Auth_User";
import { supabase } from "./supabase";

// export const login = async (email: string, password: string) => {
//   const { data, error } = await supabase.auth.signIn({ email, password });
//   return { data, error }
// };

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
  // if (prepData.individual) {
  //   dataForAuthSignup = {
  //     email: prepData.individual.contact.email,
  //     password: prepData.password,
  //   };
  // }

  try {
    // create auth user in  supabase
    const { data, error } = await supabase.auth.signUp({
      ...dataForAuthSignup,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
      },
    });
    if (error) throw error;

    //  create user profile in supabase
    const newUser = {
      name: typeof name === "string" && name,
      first_name: typeof name === "object" && name.firstName,
      last_name: typeof name === "object" && name.lastName,
      email: contact.email,
      phone: contact.phone,
      website: contact.website,
      address: prepData.addressObjToSave,
      typeOfUser: prepData.typeOfUser,
      userId: data.user?.id,
      // planId: 1  default to low plan
      // analyticsId: 1 default to low analytics
    };

    const { data: userData, error: userError } = await supabase
      .from("profiles")
      .insert([newUser])
      .select()
      .single();

    if (error) throw error;

    return { userData, userError };
  } catch (error) {
    return { data: null, error };
  }
};

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
