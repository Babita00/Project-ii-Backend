import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    transactionId: { type: String, unique: true, required: true },
    pidx: { type: String, unique: true, required: true },

    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: true,
    },
    payment_url: {
      type: String,
    },
    amount: { type: Number, required: true },
    dataFromVerificationReq: { type: Object, default: {} },
    apiQueryFromUser: { type: Object, default: {} },
    paymentGateway: {
      type: String,
      enum: ["khalti", "esewa", "IME pay"],
      required: true,
    },
    status: {
      type: String,
      enum: ["success", "pending", "failed"],
      default: "pending",
    },
    paymentDate: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

paymentSchema.index({ transactionId: 1 }, { unique: true });
paymentSchema.index({ pidx: 1 }, { unique: true });

export const Payment = mongoose.model("Payment", paymentSchema);
