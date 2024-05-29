import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
const registerUser = asyncHandler(async (req, res) => {
  res.status(200).json({ message: "OK" });
  //user registration
  const { firstname, email, lastname, password, username } = req.body;
  console.log("email:", email);

  //validation
  if (
    [fullname, email, username, password, phone].some(
      (field) => field?.trim() === "",
    )
  ) {
    throw new ApiError(400, "All field are required");
  }

  //user already exist??
  const existedUser = await User.findOne({
    $or: [{ phone }, { email }],
  });
  console.log("esisted user is:", existedUser);
  if (existedUser) {
    throw ApiError(409, "User with email or username aalready exist");
  }

  //check images
  const coverImageLocalPath = req.files?.avatar[0]?.path;
  console.log(coverImageLocalPath);

  if (!coverImageLocalPath) {
    throw new ApiError(400, "Avater File is required");
  }
  //upload to cloudinary
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);
  if (!coverImage) {
    throw new ApiError(400, "Avater File is required");
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

  console.log(userCreated);
  if (!userCreated) {
    throw new ApiError(400, "Error occured while registration");
  }
  return res
    .status(201)
    .json(new ApiResponse(200, userCreated, "User registered successfully"));
});
export { registerUser };
