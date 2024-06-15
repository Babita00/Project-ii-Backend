import { Booking } from "../models/Booking.models.js";
import { Property } from "../models/Property.models.js";
import { User } from "../models/user.models.js";
import { Payment } from "../models/payment.models.js";
import {
  verifyKhaltiPayment,
  initializeKhaltiPayment,
} from "../payment/khalti.js";
import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";

// Validate required environment variables
const validateEnvVariables = () => {
  const requiredVars = ["KHALTI_SECRET_KEY", "KHALTI_URL", "WEBSITE_URI"];
  requiredVars.forEach((varName) => {
    if (!process.env[varName]) {
      throw new ApiError(
        500,
        `Missing required environment variable: ${varName}`,
      );
    }
  });
};

// Ensure environment variables are validated at the start
validateEnvVariables();

// Route to initialize Khalti payment gateway
const initializePayment = asyncHandler(async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { propertyId, userId, amount } = req.body;

    // Validate property and user existence
    const property = await Property.findById(propertyId);
    if (!property) {
      return next(new ApiError(404, "Property not found"));
    }

    const user = await User.findById(userId);
    if (!user) {
      return next(new ApiError(404, "User not found"));
    }

    // Create new booking
    const newBooking = new Booking({
      property: propertyId,
      user: userId,
    });

    await newBooking.save({ session });

    // Create a payment document to store payment info
    // const newPayment = await Payment.create(
    //   {
    //     propertyId: propertyId,
    //     transactionId: new mongoose.Types.ObjectId().toString(),
    //     pidx: new mongoose.Types.ObjectId().toString(),
    //     amount: amount * 100, // Amount should be in paisa (Rs * 100)
    //     paymentGateway: "khalti",
    //     status: "pending",
    //   },
    //   { session },
    // );

    const paymentInitiate = await initializeKhaltiPayment({
      amount: amount * 100, // Amount should be in paisa (Rs * 100)
      purchase_order_id: propertyId, // Use the payment ID for verification later
      purchase_order_name: `Booking for ${property.title}`,
      return_url: `${process.env.WEBSITE_URI}/complete-khalti-payment`, // Can be managed from frontend as well
      website_url: `${process.env.WEBSITE_URI}`,
    });

    if (!paymentInitiate) {
      throw new ApiError(500, "Failed to initialize Khalti payment");
    }

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      success: true,
      booking: newBooking,
      payment: paymentInitiate,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return next(new ApiError(500, error.message));
  }
});

// Route to complete payment
const completePayment = asyncHandler(async (req, res, next) => {
  try {
    const { pidx } = req.body;

    // Verify the payment with Khalti
    const verificationResult = await verifyKhaltiPayment(pidx);

    if (verificationResult.status === "Completed") {
      // Find the payment record by ID
      const payment = await Payment.findOne({ pidx });
      if (!payment) {
        return next(new ApiError(404, "Payment record not found"));
      }

      // Update the payment status to success
      payment.status = "success";
      payment.dataFromVerificationReq = verificationResult;
      await payment.save();

      // Update the booking status to Paid (assuming you have a status field in Booking model)
      const booking = await Booking.findById(payment.bookingId);
      if (booking) {
        booking.status = "Paid";
        await booking.save();
      }

      res.status(200).json({
        success: true,
        message: "Payment verified successfully",
        payment,
      });
    } else {
      return next(new ApiError(400, "Payment verification failed"));
    }
  } catch (error) {
    return next(new ApiError(500, `Error verifying payment: ${error.message}`));
  }
});

export { initializePayment, completePayment };
