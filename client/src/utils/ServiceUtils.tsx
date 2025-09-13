import { Auth_User_Profile_Response } from "../interfaces/Auth_User";
import {
  DB_Flyer_Create_Unregistered_Business,
  DB_Flyer_Create_Unregistered_Individual,
  DB_Flyer_Create_Unregistered_Organization,
  DB_Flyers_Response,
} from "../interfaces/DB_Flyers";

export const getBaseUrl = () => {
  switch (process.env.NODE_ENV) {
    case "development":
    case "test":
      return "http://localhost:5000";
    case "production":
      // # TODO - get correct url
      return "to-be-determined";
    default:
      return "http://localhost:5000";
  }
};

export const getContactInfoFromFlyer = (flyer: DB_Flyers_Response) => {
  const contactInfo: any = {};
  if (flyer.user) {
    contactInfo.email = (flyer.user as Auth_User_Profile_Response).email;
    contactInfo.phone = (flyer.user as Auth_User_Profile_Response).phone;
    contactInfo.website = (flyer.user as Auth_User_Profile_Response).website;
    if ((flyer.user as Auth_User_Profile_Response).firstName) {
      contactInfo.firstName = (
        flyer.user as Auth_User_Profile_Response
      ).firstName;
      contactInfo.lastName = (
        flyer.user as Auth_User_Profile_Response
      ).lastName;
    } else {
      contactInfo.name = (flyer.user as Auth_User_Profile_Response).name;
    }
    return contactInfo;
  }

  if (flyer.typeOfUser) {
    switch (flyer.typeOfUser) {
      case "individual":
        contactInfo.email = (
          flyer as DB_Flyer_Create_Unregistered_Individual
        ).individual.contact.email;
        contactInfo.phone = (
          flyer as DB_Flyer_Create_Unregistered_Individual
        ).individual.contact.phone;
        contactInfo.firstName = (
          flyer as DB_Flyer_Create_Unregistered_Individual
        ).individual.name.firstName;
        contactInfo.lastName = (
          flyer as DB_Flyer_Create_Unregistered_Individual
        ).individual.name.lastName;
        contactInfo.website = (
          flyer as DB_Flyer_Create_Unregistered_Individual
        ).individual.contact.website;
        return contactInfo;
      case "organization":
        contactInfo.email = (
          flyer as DB_Flyer_Create_Unregistered_Organization
        ).organization.contact.email;
        contactInfo.phone = (
          flyer as DB_Flyer_Create_Unregistered_Organization
        ).organization.contact.phone;
        contactInfo.name = (
          flyer as DB_Flyer_Create_Unregistered_Organization
        ).organization.name;
        contactInfo.website = (
          flyer as DB_Flyer_Create_Unregistered_Organization
        ).organization.contact.website;
        return contactInfo;
      case "business":
        contactInfo.email = (
          flyer as DB_Flyer_Create_Unregistered_Business
        ).business.contact.email;
        contactInfo.phone = (
          flyer as DB_Flyer_Create_Unregistered_Business
        ).business.contact.phone;
        contactInfo.name = (
          flyer as DB_Flyer_Create_Unregistered_Business
        ).business.name;
        contactInfo.website = (
          flyer as DB_Flyer_Create_Unregistered_Business
        ).business.contact.website;
        return contactInfo;
      default:
        return contactInfo;
    }
  }
};

export const getContactInfoFromUser = (user: Auth_User_Profile_Response) => {
  const contactInfo: any = {};
  contactInfo.email = user.email;
  contactInfo.phone = user.phone;
  contactInfo.website = user.website;
  if (user.firstName) {
    contactInfo.firstName = user.firstName;
    contactInfo.lastName = user.lastName;
  } else {
    contactInfo.name = user.name;
  }
  return contactInfo;
};
