import { v2 as cloudinary } from "cloudinary";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Property } from "../models/Property.models.js";
import { ApiError } from "../utils/apiError.js";

const deletePropertyById = asyncHandler(async (req, res, next) => {
  const propertyId = req.params.id;

  // Check if property exists
  const property = await Property.findById(propertyId);
  if (!property) {
    return next(new ApiError(404, "Property not found"));
  }

  // Delete images from Cloudinary
  if (property.propertyImage && property.propertyImage.length > 0) {
    for (const imageUrl of property.propertyImage) {
      const publicId = imageUrl.split("/").pop().split(".")[0]; // Extract public_id from URL
      try {
        await cloudinary.uploader.destroy(publicId);
        console.log(`Image ${publicId} deleted from Cloudinary`);
      } catch (error) {
        console.error("Cloudinary Deletion Error", error);
        return next(new ApiError(500, "Error deleting images from Cloudinary"));
      }
    }
  }

  // Delete the property
  await Property.findByIdAndDelete(propertyId);

  res.status(200).json({ message: "Property deleted successfully" });
});

export { deletePropertyById };
