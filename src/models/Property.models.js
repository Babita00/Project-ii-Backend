import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
const propertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    propertyImage: {
      type: [String],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    categories: {
      type: [String],
      enum: [
        "1B",
        "1BHK",
        "2B",
        "2BHK",
        "2BK",
        "3B",
        "3BK",
        "3BHK",
        "4BHK",
        "Full House",
        "Studio",
        "Shutter",
      ],
      required: true,
    },
    amenities: {
      type: [String],
      enum: [
        "Swimming Pool",
        "Gym",
        "Garden",
        "Garage",
        "Wi-Fi'",
        "Parking",
        "Air Conditioning",
        "Security",
      ],
      default: [], // Default empty array
    },
    contactNumber: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["available", "booked"],
      default: "available",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to User schema
      required: true,
    },
  },
  { timestamps: true },
);

propertySchema.index({ location: "2dsphere" });
propertySchema.plugin(mongooseAggregatePaginate);

export const Property = mongoose.model("Property", propertySchema);
