import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    phone: {
      type: Number,
      required: true,
    },
    coverImage: {
      type: String, //cloudnary url
    },
    History: [
      {
        type: mongoose.Types.ObjectId,
        ref: "product",
      },
    ],
    password: {
      type: String,
      required: [true, "Password is required"],
    },
  },
  { timestamps: true },
);

userSchema.pre("save", function (next) {
  if (this.isModified("password")) return next();

  this.password = bcrypt.hash(this.password, 10);
  next();
});

//checking if password is correct
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = async function () {
  try {
    // 'this' refers to the current user instance
    const token = await jwt.sign(
      { _id: this._id, email: this.email, username: this.username },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
      },
    );
    return token;
  } catch (error) {
    console.error("Error generating access token:", error);
    throw error;
  }
};
userSchema.methods.generateRefreshToken = async function () {
  try {
    const token = await jwt.sign(
      { _id: this._id },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
      },
    );
    return token;
  } catch (error) {
    console.error("Error generating access token:", error);
    throw error;
  }
};
export const User = mongoose.model("User", userSchema);
