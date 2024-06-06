import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";

//logout user
const logoutUser = asyncHandler(async (req, res) => {
  try {
    // Invalidate tokens on the server side (optional)
    await User.findByIdAndUpdate(
      req.user._id,
      {
        $unset: {
          refreshToken: 1, // this removes the field from document
        },
      },
      {
        new: true,
      },
    );

    // Respond to the client
    return res.status(200).json(new ApiResponse(200, {}, "User logged out"));
  } catch (error) {
    return next(new ApiError(500, "Error logging out user"));
  }
});
export { logoutUser };
