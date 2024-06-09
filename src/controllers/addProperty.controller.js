import { Property } from "../models/Property.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { parseAndValidateLocation } from "./parseAndValidateLocation.controller.js";

const addProperty = asyncHandler(async (req, res, next) => {
  const {
    title,
    description,
    address,
    latitude,
    longitude,
    amount,
    categories,
  } = req.body;

  // Validate required fields
  if (!title || !description || !address || !amount || !categories) {
    return next(new ApiError(400, "All fields are required"));
  }

  // Ensure latitude and longitude are within valid ranges
  let validLatitude = parseFloat(latitude);
  let validLongitude = parseFloat(longitude);
  if (
    validLatitude < -90 ||
    validLatitude > 90 ||
    validLongitude < -180 ||
    validLongitude > 180
  ) {
    // If values are swapped, swap them back
    if (
      validLatitude >= -180 &&
      validLatitude <= 180 &&
      validLongitude >= -90 &&
      validLongitude <= 90
    ) {
      [validLatitude, validLongitude] = [validLongitude, validLatitude];
    } else {
      return next(new ApiError(400, "Invalid latitude or longitude values"));
    }
  }

  // Validate and parse location
  let parsedLocation;
  try {
    parsedLocation = parseAndValidateLocation(validLatitude, validLongitude);
    console.log("Parsed Location:", parsedLocation);
  } catch (error) {
    return next(new ApiError(400, "Invalid location data"));
  }

  // Check for property images in the request
  const propertyImageFiles = req.files?.propertyImage;
  if (!propertyImageFiles || propertyImageFiles.length === 0) {
    return next(new ApiError(400, "At least one property image is required"));
  }

  try {
    // Upload property images to Cloudinary
    const propertyImageUrls = await Promise.all(
      propertyImageFiles.map(async (file) => {
        try {
          const imageUrl = await uploadOnCloudinary(file.path);
          return imageUrl.url;
        } catch (error) {
          console.error("Cloudinary Upload Error", error);
          throw new ApiError(500, "Error uploading image to Cloudinary");
        }
      }),
    );

    // Create a new property
    const newProperty = new Property({
      title,
      description,
      address,
      location: parsedLocation,
      propertyImage: propertyImageUrls,
      amount,
      categories,
    });

    // Validate the property before saving
    try {
      await newProperty.validate();
    } catch (validationError) {
      console.error(
        "Validation Error: Property validation failed",
        validationError,
      );
      return next(
        new ApiError(400, `Validation error: ${validationError.message}`),
      );
    }

    // Save the property to the database
    await newProperty.save();

    // Send a response with the created property
    return res.status(201).json({
      status: 201,
      message: "Property added successfully",
      property: newProperty,
    });
  } catch (error) {
    console.error("Database Error: Error adding property to database", error);
    return next(
      new ApiError(500, `Error adding property to database: ${error.message}`),
    );
  }
});

export { addProperty };
