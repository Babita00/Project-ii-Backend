import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { Property } from "../models/Property.models.js"; // Import Property model

const nearestLocation = asyncHandler(async (req, res, next) => {
  try {
    const { latitude, longitude } = req.query;

    // Validate input
    if (!latitude || !longitude) {
      throw new ApiError(400, "Latitude and Longitude are required");
    }

    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    if (isNaN(lat) || isNaN(lng)) {
      throw new ApiError(400, "Invalid latitude or longitude");
    }

    const properties = await Property.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [lng, lat],
          },
          $maxDistance: 5000, // 5 kilometers
        },
      },
    });

    res.status(200).json(new ApiResponse(200, "Properties found", properties));
  } catch (error) {
    next(new ApiError(500, `Error finding properties: ${error.message}`));
  }
});

export { nearestLocation };
