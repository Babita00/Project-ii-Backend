import { Product } from "../models/product.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";

// Function to search for products
const searchProducts = asyncHandler(async (req, res, next) => {
  const { query } = req.query;

  if (!query) {
    return next(new ApiError(400, "Search query is required"));
  }

  // Create a case-insensitive search regex
  const searchRegex = new RegExp(query, "i");

  // Search products by title, description, location, or id
  const products = await Product.find({
    $or: [
      { title: searchRegex },
      { description: searchRegex },
      { location: searchRegex },
    ],
  });

  return res
    .status(201)
    .json(new ApiResponse(200, "Searching a product......"));
});
export { searchProducts };
