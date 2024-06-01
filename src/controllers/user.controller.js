import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const registerUser = asyncHandler(async (req, res) => {
  //user registration
  try {
    const { firstname, lastname, email, password, username, phone } = req.body;

    //validation
    if (
      [firstname, lastname, email, username, password, phone].some(
        (field) => field?.trim() === "",
      )
    ) {
      throw new ApiError(400, "All field are required");
    }

    //user already exist??
    const existedUser = await User.findOne({
      $or: [{ phone }, { email }],
    });
    if (existedUser) {
      throw new ApiError(409, "User with email or username already exist");
    }

    //check images
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if (!coverImageLocalPath) {
      throw new ApiError(400, "Cover image File is required");
    }
    //upload to cloudinary
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);
    if (!coverImage) {
      throw new ApiError(400, "cover image File is required");
    }

    //make an object
    await User.create({
      firstname,
      lastname,
      coverImage: coverImage?.url || "",
      email,
      password,
      phone,
      username: username.toLowerCase(),
    });

    return res
      .status(201)
      .json(new ApiResponse(200, "User registered successfully"));
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
});

export { registerUser };
