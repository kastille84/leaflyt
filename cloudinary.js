const { keysBasedOnEnv } = require("./server/utility/generalUtils");

// import { v2 as cloudinary } from "cloudinary";
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: keysBasedOnEnv().cloudinary.name,
  api_key: keysBasedOnEnv().cloudinary.apiKey,
  api_secret: keysBasedOnEnv().cloudinary.apiSecret,
});

exports.cloudinary = cloudinary;
