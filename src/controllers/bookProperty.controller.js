import { Booking } from "../models/Booking.models.js";
import { Property } from "../models/Property.models.js";
import { User } from "../models/user.models.js"; // Assuming you have a User model

// Add a new booking
const addBooking = async (req, res) => {
  try {
    const { propertyId, userId, startDate, endDate } = req.body;

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
    res
      .status(201)
      .json({ message: "Booking created successfully", booking: newBooking });
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

    // Update booking status to 'Cancelled'
    booking.status = "Cancelled";
    await booking.save();

    res
      .status(200)
      .json({ message: "Booking cancelled successfully", booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { addBooking, cancelBooking };
