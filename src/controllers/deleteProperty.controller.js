import { asyncHandler } from "../utils/asyncHandler.js";
import { Property } from "../models/Property.models.js";
import { ApiError } from "../utils/apiError.js";

//  to delete a product by ID

const deletePropertyById = async (req, res) => {
  try {
    const propertyId = req.params.id;

    // Check if property exists
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    // Delete the property
    await Property.findByIdAndDelete(propertyId);

    res.status(200).json({ message: "Property deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting property", error });
  }
};

export { deletePropertyById };
