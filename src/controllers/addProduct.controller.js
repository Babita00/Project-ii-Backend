import { Product } from "../models/product.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js"; // Ensure this utility function is implemented

// Function to add a new product
const addProduct = asyncHandler(async (req, res, next) => {
  const { title, description, location, amount, owner, categories } = req.body;

  // Validate required fields
  if (!title || !description || !location || !amount || !owner || !categories) {
    return next(new ApiError(400, "All fields are required"));
  }

  // Check for product images in the request
  const productImageFiles = req.files?.productImage; // assuming 'productImage' is the field name for multiple file uploads
  if (!productImageFiles || productImageFiles.length === 0) {
    return next(new ApiError(400, "At least one product image is required"));
  }

  try {
    // Upload product images to Cloudinary
    const productImageUrls = await Promise.all(
      productImageFiles.map(async (file) => {
        try {
          const imageUrl = await uploadOnCloudinary(file.path);
          return imageUrl.url;
        } catch (error) {
          throw new ApiError(500, "Error uploading image to Cloudinary");
        }
      }),
    );

    // Create a new product
    const newProduct = new Product({
      title,
      description,
      location,
      productImage: productImageUrls, // storing the uploaded image URLs
      amount,
      owner,
      categories, // added categories field
    });

    // Save the product to the database
    await newProduct.save();
    console.log("Product saved to database successfully");

    // Send a response with the created product
    return res.status(201).json({
      status: 200,
      message: "Product added successfully",
      product: newProduct,
    });
  } catch (error) {
    return next(new ApiError(500, "Error adding product to database"));
  }
});

export { addProduct };
