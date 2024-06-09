import { ApiError } from "../utils/apiError.js";

export const parseAndValidateLocation = (latitude, longitude) => {
  const parsedLatitude = parseFloat(latitude);
  const parsedLongitude = parseFloat(longitude);

  if (isNaN(parsedLatitude) || isNaN(parsedLongitude)) {
    throw new ApiError(400, "Latitude and longitude must be valid numbers.");
  }

  return {
    type: "Point",
    coordinates: [parsedLongitude, parsedLatitude],
  };
};
