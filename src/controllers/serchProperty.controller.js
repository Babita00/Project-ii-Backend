import { Property } from "../models/Property.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";

// Function to search for properties
const searchProperty = asyncHandler(async (req, res, next) => {
  const { query } = req.query;

  // Check if the search query is provided
  if (!query) {
    return next(new ApiError(400, "Search query is required"));
  }

  // Create a case-insensitive search regex
  const searchRegex = new RegExp(query, "i");

  try {
    // Search properties by title, description, address, or categories
    const properties = await Property.find({
      $or: [
        { title: searchRegex },
        { description: searchRegex },
        { address: searchRegex },
        { categories: searchRegex },
      ],
    });

    // If no properties are found, respond with a 404 status
    if (properties.length === 0) {
      return res
        .status(404)
        .json(new ApiResponse(404, "No properties found matching your query"));
    }

    // Respond with the found properties
    return res
      .status(200)
      .json(new ApiResponse(200, "Properties found", properties));
  } catch (error) {
    // Log the error for debugging purposes
    console.error("Error finding properties:", error);

    // Respond with a 500 status code and the error message
    return res
      .status(500)
      .json(
        new ApiResponse(500, "Error finding properties", {
          error: error.message,
        }),
      );
  }
});

export { searchProperty };
