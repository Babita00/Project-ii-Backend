import { asyncHandler } from "../utils/asyncHandler.js";
import { Product } from "../models/product.models.js";
import { ApiError } from "../utils/apiError.js";

//  to delete a product by ID

const deleteProductById = asyncHandler(async (req, res, next) => {
  const deletedProduct = await Product.findByIdAndDelete(req.params.id);

  if (!deletedProduct) {
    return next(new ApiError(404, "Product not found"));
  }

  res.status(200).json({
    success: true,
    message: "Product deleted successfully",
  });
});
export { deleteProductById };
