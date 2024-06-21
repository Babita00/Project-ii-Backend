import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import crypto from "crypto";
import sendEmail from "../utils/sendEmail.js";

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  //check user
  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "User not found with this email");
  }

  // Generate 4-digit reset code
  const resetCode = Math.floor(1000 + Math.random() * 9000).toString();

  // Hash code and set to resetPasswordToken field
  user.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetCode)
    .digest("hex");

  // Set token expire time
  user.resetPasswordExpire = Date.now() + 30 * 60 * 1000; // 30 minutes

  await user.save({ validateBeforeSave: false });

  // Create email message
  const message = `You are receiving this email because you have requested the reset of a password. Please use the following code to reset your password: \n\n ${resetCode}`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Password reset code",
      message,
    });

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Email sent successfully"));
  } catch (err) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    throw new ApiError(500, "Email could not be sent");
  }
});

//to reset password
const resetPassword = asyncHandler(async (req, res) => {
  const { resetCode } = req.body;
  const { password } = req.body;

  // Hash the code
  const hashedCode = crypto
    .createHash("sha256")
    .update(resetCode)
    .digest("hex");

  // Find user by code and check if the code has not expired
  const user = await User.findOne({
    resetPasswordToken: hashedCode,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    throw new ApiError(400, "Invalid or expired code");
  }

  // Set new password
  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password reset successfully"));
});

export { resetPassword, forgotPassword };
