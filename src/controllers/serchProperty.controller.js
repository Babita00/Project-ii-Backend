import { Property } from "../models/Property.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";

// Function to search for products
const searchProperty = asyncHandler(async (req, res, next) => {
  try {
    const { query } = req.query;
    if (!query) {
      return next(new ApiError(400, "Search query is required"));
    }

    // Create a case-insensitive search regex
    const searchRegex = new RegExp(query, "i");
    console.log(searchRegex);
    // Search products by title, description, location, or id
    const properties = await Property.find({
      $or: [
        { title: searchRegex },
        { description: searchRegex },
        { address: searchRegex },
        { categories: searchRegex },
      ],
    });

    if (properties.length === 0) {
      return res
        .status(404)
        .json(new ApiResponse(404, "No products found matching your query"));
    }

    return res
      .status(201)
      .json(new ApiResponse(200, "Searching a product......"));
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error on finding a product", error });
  }
});
export { searchProperty };
