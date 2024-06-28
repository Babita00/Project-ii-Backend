import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
  const { firstname, lastname, email, password } = req.body;

  // Validation
  if (
    [firstname, lastname, email, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  // Check if user already exists
  const existedUser = await User.findOne({ email });
  if (existedUser) {
    throw new ApiError(409, "User with email already exists");
  }

  // Create new user
  await User.create({
    firstname,
    lastname,
    email,
    password,
  });

  return res
    .status(201)
    .json(new ApiResponse(200, "User registered successfully"));
});

const errorHandler = (err, req, res, next) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      message: err.message,
      error: err.error || [],
      success: false,
      data: null,
    });
  }

  console.error(err); // Log the error for debugging purposes
  return res.status(500).json({
    message: "An unexpected error occurred",
    error: [],
    success: false,
    data: null,
  });
};

export { registerUser, errorHandler };
