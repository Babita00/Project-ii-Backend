import { Property } from "../models/Property.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";

// Function to fetch all properties
const getAllProperties = asyncHandler(async (req, res) => {
  const properties = await Property.find()
    .populate("createdBy", "username")
    .exec();
  res.status(200).json({
    success: true,
    data: properties,
  });
});

// Function to fetch a single property by ID
const getPropertyById = asyncHandler(async (req, res, next) => {
  const property = await Property.findById(req.params.id)
    .populate("createdBy", "firstname")
    .exec();
  console.log(property);

  if (!property) {
    return next(new ApiError(404, "Property not found"));
  }

  return res.status(200).json({
    success: true,
    message: "Property fetched successfully",
    data: property,
  });
});

// Function to get properties by user ID
const getPropertiesByUserId = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;

  if (!userId) {
    return next(new ApiError(400, "User ID is required"));
  }

  try {
    // Find properties created by the specified user
    const properties = await Property.find({ createdBy: userId });

    if (!properties.length) {
      return res.status(404).json({
        status: 404,
        message: "No properties found for this user",
      });
    }

    // Return the found properties
    return res.status(200).json({
      status: 200,
      properties,
    });
  } catch (error) {
    console.error("Database Error: Error fetching properties", error);
    return next(
      new ApiError(500, `Error fetching properties: ${error.message}`),
    );
  }
});

export { getAllProperties, getPropertyById, getPropertiesByUserId };
