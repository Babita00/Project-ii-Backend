import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    // Generate a unique public_id for each upload
    const publicId = `property_image_${uuidv4()}`;

    // Upload the file to Cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
      public_id: publicId, // Unique Public ID for the uploaded file
    });

    console.log("File is uploaded to Cloudinary", response.url);
    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    console.error("Error uploading file to Cloudinary:", error);
    fs.unlinkSync(localFilePath); // Remove the locally saved temporary file if operation fails
    throw error; // Rethrow the error to propagate it further if necessary
  }
};

export { uploadOnCloudinary };
