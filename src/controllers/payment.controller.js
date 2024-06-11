import { Booking } from "../models/Booking.models.js";
import { Property } from "../models/Property.models.js";
import { User } from "../models/user.models.js";
import { Payment } from "../models/payment.models.js";
import {
  verifyKhaltiPayment,
  initializeKhaltiPayment,
} from "../payment/khalti.js";

// Route to initialize Khalti payment gateway
const initializePayment = async (req, res) => {
  try {
    const { propertyId, userId, startDate, endDate, amount, website_url } =
      req.body;

    // Validate property and user existence
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Create new booking
    const newBooking = new Booking({
      property: propertyId,
      user: userId,
      startDate,
      endDate,
    });

    await newBooking.save();

    // Create a payment document to store payment info
    const newPayment = await Payment.create({
      bookingId: newBooking._id,
      amount: amount * 100, // Amount should be in paisa (Rs * 100)
      paymentGateway: "khalti",
      status: "pending",
    });

    const paymentInitiate = await initializeKhaltiPayment({
      amount: amount * 100, // Amount should be in paisa (Rs * 100)
      purchase_order_id: newPayment._id, // Use the payment ID for verification later
      purchase_order_name: `Booking for ${property.title}`,
      return_url: `${process.env.BACKEND_URI}/complete-khalti-payment`, // Can be managed from frontend as well
      website_url,
    });

    res.status(201).json({
      success: true,
      booking: newBooking,
      payment: paymentInitiate,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Route to verify Khalti payment
const completePayment = async (req, res) => {
  try {
    const { pidx } = req.body;

    // Verify the payment with Khalti
    const verificationResult = await verifyKhaltiPayment(pidx);

    if (verificationResult.status === "Completed") {
      // Find the payment record by ID
      const payment = await Payment.findOne({ pidx });
      if (!payment) {
        return res.status(404).json({ message: "Payment record not found" });
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
      res
        .status(400)
        .json({ success: false, message: "Payment verification failed" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
export { initializePayment, completePayment };
