import { Product } from "../models/product.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js"; // Ensure this utility function is implemented

// Function to add a new product
const addProduct = asyncHandler(async (req, res, next) => {
  const { title, description, location, amount, owner } = req.body;

  // Validate required fields
  if (!title || !description || !location || !amount || !owner) {
    return next(new ApiError(400, "All fields are required"));
  }

  // Check for product images in the request
  const productImageFiles = req.files?.productImage; // assuming 'productImage' is the field name for multiple file uploads
  if (!productImageFiles || productImageFiles.length === 0) {
    return next(new ApiError(400, "At least one product image is required"));
  }

  // Upload product images to Cloudinary
  const productImageUrls = await Promise.all(
    productImageFiles.map(async (file) => {
      try {
        const imageUrl = await uploadOnCloudinary(file.path);
        return imageUrl;
      } catch (error) {
        throw new ApiError(500, "Error uploading image to Cloudinary");
      }
    }),
  );

  // Create a new product
  const product = new Product({
    title,
    description,
    location,
    photos: productImageUrls, // storing the uploaded image URLs
    amount,
    owner,
  });

  // Save the product to the database
  await product.save();

  // Send a response with the created product
  res.status(201).json({
    success: true,
    data: product,
  });
});

export { addProduct };
