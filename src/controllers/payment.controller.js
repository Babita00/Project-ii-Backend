import axios from "axios";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { Payment } from "../models/payment.models.js";
import { Property } from "../models/Property.models.js";
import { User } from "../models/user.models.js";

// Initialize payment
const initializePayment = asyncHandler(async (req, res, next) => {
  const { amount, propertyId } = req.body;

  // Fetch property details
  const property = await Property.findById(propertyId);
  if (!property) {
    return next(new ApiError(404, "Property not found"));
  }

  // Use user details from req.user
  const user = req.user;
  const purchase_order_id = `order_${new Date().getTime()}_${propertyId}`;
  const purchase_order_name = property.title;

  // const customer_info = {
  //   name: `${user.firstname} ${user.lastname}`,
  //   email: user.email,
  // };

  const options = {
    method: "POST",
    url: "https://a.khalti.com/api/v2/epayment/initiate/",
    headers: {
      Authorization: `key ${process.env.KHALTI_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    data: {
      return_url: "http://localhost:8080/success",
      website_url: "http://localhost:8080/",
      amount,
      purchase_order_id,
      purchase_order_name,
      // customer_info,
    },
  };

  try {
    const result = await axios(options);
    const payment = new Payment({
      transactionId: result.data.token,
      pidx: purchase_order_id,
      propertyId: property._id, // Ensure propertyId is saved
      payment_url: result.data.payment_url,
      amount,
      paymentGateway: "khalti",
      status: "pending",
    });

    await payment.save();

    res.status(200).json({ payment_url: result.data.payment_url });
  } catch (error) {
    console.error("Payment Initialization Error:", error);
    return next(new ApiError(500, "Error initializing payment"));
  }
});

// Complete payment
// Complete payment
const completePayment = asyncHandler(async (req, res, next) => {
  const { token, amount, pidx } = req.body; // Assuming these are sent in the request body

  const options = {
    method: "POST",
    url: "https://a.khalti.com/api/v2/epayment/verify/",
    headers: {
      Authorization: `key ${process.env.KHALTI_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    data: {
      token,
      amount,
    },
  };

  try {
    const result = await axios(options);
    if (result.data.state.name === "Completed") {
      // Find and update the payment status
      const payment = await Payment.findOne({ pidx });
      if (!payment) {
        return next(new ApiError(404, "Payment record not found"));
      }
      payment.status = "success";
      payment.dataFromVerificationReq = result.data;
      await payment.save();

      // Update the property status to booked
      const property = await Property.findById(payment.propertyId);
      if (property) {
        property.status = "booked";
        await property.save();
      }

      res.status(200).json({ message: "Payment completed successfully" });
    } else {
      return next(new ApiError(400, "Payment verification failed"));
    }
  } catch (error) {
    console.error("Payment Verification Error:", error);
    return next(new ApiError(500, "Error verifying payment"));
  }
});

export { initializePayment, completePayment };
