import { Payment } from "../models/payment.models.js";
import { verifyKhaltiPayment } from "./khalti"; // Import your Khalti payment verification function

// Route to verify Khalti payment
const completePayment = async (req, res) => {
  try {
    const { token, amount, purchase_order_id } = req.body;

    // Verify the payment with Khalti
    const verificationResult = await verifyKhaltiPayment({ token, amount });

    if (verificationResult.success) {
      // Find the payment record by ID
      const payment = await Payment.findById(purchase_order_id);
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
export { completePayment };
