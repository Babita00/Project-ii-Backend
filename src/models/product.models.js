import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    productImage: {
      type: [String],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    categories: {
      type: String,
      enum: [
        "1B",
        "1BHK",
        "2B",
        "2BHK",
        "2BK",
        "3B",
        "3BK",
        "3BHK",
        "Full House",
      ],
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);
productSchema.plugin(mongooseAggregatePaginate);
export const Product = mongoose.model("Product", productSchema);
