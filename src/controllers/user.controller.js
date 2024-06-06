import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
  //user registration
  try {
    const { firstname, lastname, email, password } = req.body;

    //validation
    if (
      [firstname, lastname, email, password].some(
        (field) => field?.trim() === "",
      )
    ) {
      throw new ApiError(400, "All field are required");
    }

    //user already exist??
    const existedUser = await User.findOne({ email });
    if (existedUser) {
      throw new ApiError(409, "User with email already exist");
    }

    //make an object
    await User.create({
      firstname,
      lastname,
      email,
      password,
    });

    return res
      .status(201)
      .json(new ApiResponse(200, "User registered successfully"));
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
});

export { registerUser };
