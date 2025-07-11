// import { v2 as cloudinary } from "cloudinary";
// import { Cloudinary as cloudinary } from "@cloudinary/url-gen";
import { UploadApiResponse } from "cloudinary";

// if (!import.meta.env.VITE_CLOUDINARY_API_KEY) {
//   throw new Error("CLOUDINARY_API_KEY is not set");
// }

// if (!import.meta.env.VITE_CLOUDINARY_API_SECRET) {
//   throw new Error("CLOUDINARY_API_SECRET is not set");
// }

// cloudinary.config({
//   cloud_name: import.meta.env.VITE_CLOUDINARY_NAME,
//   api_key: import.meta.env.VITE_CLOUDINARY_API_KEY,
//   api_secret: import.meta.env.VITE_CLOUDINARY_API_SECRET,
// });

// export async function uploadImage(image) {
//   const imageData = await image.arrayBuffer();
//   const mime = image.type;
//   const encoding = 'base64';
//   const base64Data = Buffer.from(imageData).toString('base64');
//   const fileUri = 'data:' + mime + ';' + encoding + ',' + base64Data;
//   const result = await cloudinary.uploader.upload(fileUri, {
//     folder: 'nextjs-course-mutations',
//   });
//   return result.secure_url;
// }

export async function deleteFileOverTime(
  imgToRemoveFromCloudinary: UploadApiResponse
) {
  // const result = await cloudinary.uploader.destroy(
  //   imgToRemoveFromCloudinary.public_id
  // );
  try {
    await fetch(
      `https://api.cloudinary.com/v1_1/${
        import.meta.env.VITE_CLOUDINARY_NAME
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
