import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    //upload the file to Cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
      public_id: "olympic_flag", // Public ID for the uploaded file
    });

    console.log("File is uploaded to Cloudinary", response.url);
    console.log(response);
    console.log(response.url); // Corrected typo
    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    console.error("Error uploading file to Cloudinary:", error);
    fs.unlinkSync(localFilePath); //remove the locally saved temporary file if operation got failed
    throw error; // rethrow the error to propagate it further if necessary
  }
};

export { uploadOnCloudinary };
