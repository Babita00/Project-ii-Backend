import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const registerUser = asyncHandler(async (req, res) => {
  //user registration
  const { firstname, lastname, email, password, username, phone } = req.body;
  console.log(req.body);
  console.log("username:", username);
  console.log("phone number:", phone);
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
  console.log("Existed user is:", existedUser);
  if (existedUser) {
    throw ApiError(409, "User with email or username already exist");
  }

  //check images
  const coverImageLocalPath = req.files?.coverImage[0]?.path;
  console.log(coverImageLocalPath);

  if (!coverImageLocalPath) {
    throw new ApiError(400, "Avater File is required");
  }
  //upload to cloudinary
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);
  if (!coverImage) {
    throw new ApiError(400, "cover image File is required");
  }

  //make an object
  const user = await User.create({
    firstname,
    lastname,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.lowercase,
  });

  const userCreated = await user.findId(user._id).select("-password ");

  console.log("created ser is:", userCreated);
  if (!userCreated) {
    throw new ApiError(400, "Error occured while registration");
  }
  return res
    .status(201)
    .json(new ApiResponse(200, userCreated, "User registered successfully"));
});

export { registerUser };
