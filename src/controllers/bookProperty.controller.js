import { Booking } from "../models/Booking.models.js";
import { Property } from "../models/Property.models.js";
import { User } from "../models/user.models.js"; // Assuming you have a User model

// Add a new booking
const bookProperty = async (req, res) => {
  try {
    const { propertyId, userId, startDate, endDate } = req.body;

    // Validate property and user existence
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    if (property.status === "booked") {
      return res.status(400).json({ message: "Property is already booked" });
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

    // Save booking and update property status
    await newBooking.save();
    property.status = "booked";
    await property.save();

    res.status(201).json({
      message: "Booking created successfully",
      booking: newBooking,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Cancel a booking
const cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;

    // Find booking by ID
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Find the associated property
    const property = await Property.findById(booking.property);
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    // Update booking status to 'Cancelled' (if such a status exists in your Booking model)
    booking.status = "Cancelled";

    // Remove the booking
    await Booking.deleteOne({ _id: bookingId });

    // Update property status to 'available'
    property.status = "available";
    await property.save();

    res.status(200).json({
      message: "Booking cancelled successfully",
      booking,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { bookProperty, cancelBooking };
