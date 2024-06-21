import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";

const updateUser = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { firstname, lastname, email, password } = req.body;

    // Validation
    if (
      [firstname, lastname, email, password].some(
        (field) => field?.trim() === "",
      )
    ) {
      throw new ApiError(400, "All fields are required");
    }

    // Check if user exists
    const user = await User.findById(id);
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    // Check if email is already taken by another user
    const emailTaken = await User.findOne({ email, _id: { $ne: id } });
    if (emailTaken) {
      throw new ApiError(409, "Email is already taken");
    }

    // Update user information
    user.firstname = firstname;
    user.lastname = lastname;
    user.email = email;
    if (password) {
      user.password = password; // Assuming password hashing middleware is in place
    }
    await user.save();

    return res
      .status(200)
      .json(new ApiResponse(200, "User updated successfully", user));
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    return res
      .status(500)
      .json({ message: "Problem occurred during updating user", error });
  }
});

export { updateUser };
