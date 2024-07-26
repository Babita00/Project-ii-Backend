import { Property } from "../models/Property.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

// Function to handle image uploads
const handleImageUpload = async (files, next) => {
  try {
    const imageUrls = [];
    if (files) {
      for (const file of files) {
        try {
          const imageUrl = await uploadOnCloudinary(file.path);
          imageUrls.push(imageUrl.url);
        } catch (error) {
          console.error("Cloudinary Upload Error", error);
          throw new ApiError(500, "Error uploading image to Cloudinary");
        }
      }
    }
    return imageUrls;
  } catch (error) {
    console.error("Image Upload Error", error);
    next(new ApiError(500, `Error uploading images: ${error.message}`));
  }
};

// Function to update a property by ID
const updatePropertyById = asyncHandler(async (req, res, next) => {
  try {
    const {
      title,
      description,
      address,
      latitude,
      longitude,
      amount,
      categories,
      propertyImage,
    } = req.body;

    // Log the incoming request body
    console.log("Request Body:", req.body);

    // Handle image upload if files are present
    const propertyImageFiles = req.files?.propertyImage;
    const propertyImageUrls = await handleImageUpload(propertyImageFiles, next);
    if (!propertyImageUrls && propertyImageFiles) return; // Handle error during image upload

    // Update location if latitude and longitude are provided
    const parsedLocation =
      latitude && longitude
        ? {
            type: "Point",
            coordinates: [longitude, latitude],
          }
        : undefined;

    const updateData = {
      title,
      description,
      address,
      amount,
      categories,
    };

    // Include updated images and location if present
    if (propertyImageUrls) updateData.propertyImage = propertyImageUrls;
    if (parsedLocation) updateData.location = parsedLocation;

    // Update the property in the database
    const updateProperty = await Property.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true },
    );

    if (!updateProperty) {
      return next(new ApiError(404, "Property not found"));
    }

    return res
      .status(200)
      .json(new ApiResponse(200, "Property Updated", updateProperty));
  } catch (error) {
    console.error("Error updating property:", error);
    return res
      .status(500)
      .json({ message: "Problem occurred while updating", error });
  }
});

export { updatePropertyById };
