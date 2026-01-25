import { UploadApiResponse } from "cloudinary";
import { keysBasedOnEnv } from "../utils/GeneralUtils";

export async function deleteFileOverTime(
  imgToRemoveFromCloudinary: UploadApiResponse
) {
  // const result = await cloudinary.uploader.destroy(
  //   imgToRemoveFromCloudinary.public_id
  // );
  try {
    await fetch(
      `https://api.cloudinary.com/v1_1/${
        keysBasedOnEnv().cloudinary.name
      }/delete_by_token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `token=${imgToRemoveFromCloudinary.delete_token}`,
      }
    );
  } catch (error: any) {
    console.log("error deleting file", error);
    throw new Error(error.message);
  }
}
