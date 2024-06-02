import { Product } from "../models/product.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";

// Function to update a product by ID
const updateProductById = asyncHandler(async (req, res, next) => {
  const { title, description, location, amount, owner, productImage } =
    req.body;

  const updatedProduct = await Product.findByIdAndUpdate(
    req.params.id,
    { title, description, location, amount, owner, productImage },
    { new: true, runValidators: true },
  );

  if (!updatedProduct) {
    return next(new ApiError(404, "Product not found"));
  }

  res.status(200).json({
    success: true,
    data: updatedProduct,
  });
});
export { updateProductById };
