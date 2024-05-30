import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";

//user login
const loginUser = asyncHandler(async (req, res) => {
  try {
    //get data from user
    const { email, password } = req.body;

    // email id required
    if (!email) {
      throw new ApiError(400, "email is required");
    }

    //find user from database
    const user = await User.findOne({ email });
    if (!user) {
      throw new ApiError(400, "user does not exist");
    }

    //check user password
    const validPassword = await user.isPasswordCorrect(password);
    if (!validPassword) {
      throw new ApiError(401, "Invalid password");
    }

    //assign access and refresh token
    const generateAccessAndRefereshTokens = async (userId) => {
      try {
        const user = await User.findById(userId);

        //generate access and refresh token
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        //add to database
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
      } catch (error) {
        throw new ApiError(
          500,
          "Something went wrong while generating referesh and access token",
        );
      }
    };

    await generateAccessAndRefereshTokens(user._id);
    const loggedInUser = await User.findById(user._id).select(
      "-password -refreshToken",
    );

    //send response

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { user: loggedInUser, accessToken, refreshToken },
          "User logged in successfully",
        ),
      );
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
    //return res.status(500).json(new ApiResponse(500, "Internal server error"));
  }
});

export { loginUser };
