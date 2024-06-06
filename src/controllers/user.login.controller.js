import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import bcrypt from "bcrypt";
// Login user
const loginUser = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate request
    if (!email || !password) {
      throw new ApiError(400, "Email and password are required");
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      throw new ApiError(401, "Invalid email or password");
    }

    // Check if password is correct
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      throw new ApiError(401, "Invalid  password");
    }

    // Generate access token
    const accessToken = user.generateAccessToken();

    // Generate refresh token
    const refreshToken = user.generateRefreshToken();

    // Respond with tokens
    return res.status(200).json(
      new ApiResponse(200, "Login successful", {
        accessToken,
        refreshToken,
      }),
    );
  } catch (error) {
    return res.status(500).json({ message: "Can not login", error });
  }
});

export { loginUser };
