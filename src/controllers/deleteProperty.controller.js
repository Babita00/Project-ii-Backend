import { asyncHandler } from "../utils/asyncHandler.js";
import { Property } from "../models/Property.models.js";
import { ApiError } from "../utils/apiError.js";

//  to delete a product by ID

const deletePropertyById = asyncHandler(async (req, res, next) => {
  const deletedProperty = await Property.findByIdAndDelete(req.params.id);

  if (!deletedProperty) {
    return next(new ApiError(404, "Product not found"));
  }

  res.status(200).json({
    success: true,
    message: "Product deleted successfully",
  });
});
export { deletePropertyById };
