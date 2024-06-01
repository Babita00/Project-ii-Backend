// Function to update a product by ID
const updateProductById = asyncHandler(async (req, res, next) => {
  const { title, description, location, amount, owner, photos } = req.body;

  const updatedProduct = await Product.findByIdAndUpdate(
    req.params.id,
    { title, description, location, amount, owner, photos },
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
