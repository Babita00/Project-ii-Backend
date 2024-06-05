import { Product } from "../models/product.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";

// Function to fetch all products

const getAllProducts = asyncHandler(async (req, res) => {
  const products = await Product.find();
  res.status(200).json({
    success: true,
    data: products,
  });
});

// Function to fetch a single product by ID
const getProductById = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ApiError(404, "Product not found"));
  }

  return res
    .status(201)
    .json(new ApiResponse(200, "Product fetched successfully"));
});
export { getAllProducts, getProductById };
