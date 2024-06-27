import { Property } from "../models/Property.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";

// Function to fetch all properties
const getAllProperties = asyncHandler(async (req, res) => {
  const properties = await Property.find();
  res.status(200).json({
    success: true,
    data: properties,
  });
});

// Function to fetch a single property by ID
const getPropertyById = asyncHandler(async (req, res, next) => {
  const property = await Property.findById(req.params.id);

  if (!property) {
    return next(new ApiError(404, "Property not found"));
  }

  return res.status(200).json({
    success: true,
    message: "Property fetched successfully",
    data: property,
  });
});

export { getAllProperties, getPropertyById };
