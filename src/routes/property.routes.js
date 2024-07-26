import express from "express";
import { upload } from "../middleware/multer.middleware.js";
import { addProperty } from "../controllers/addProperty.controller.js";
import { uploadPropertyImages } from "../controllers/addProperty.controller.js";
import { updatePropertyById } from "../controllers/updateProperty.controller.js";
import { deletePropertyById } from "../controllers/deleteProperty.controller.js";
import {
  getAllProperties,
  getPropertyById,
  getPropertiesByUserId,
} from "../controllers/fetchProperty.controller.js";
import { searchProperty } from "../controllers/serchProperty.controller.js";
import {
  bookProperty,
  cancelBooking,
} from "../controllers/bookProperty.controller.js";
import { nearestLocation } from "../controllers/nearestlocationRecommendation.controller.js";
import { verifyJWT } from "../middleware/jwtauth.middleware.js";

const router = express.Router();

// Route for adding a property with authentication
router.route("/add").post(
  verifyJWT,
  upload.fields([
    {
      name: "propertyImage",
      maxCount: 10,
    },
  ]),
  addProperty,
);

// Route for uploading property images
router.route("/uploadImages").post(
  upload.fields([
    {
      name: "propertyImage",
      maxCount: 10,
    },
  ]),
  uploadPropertyImages,
);

//search Property
router.route("/searchProperty").get(searchProperty);

//nearest location
router.route("/nearest").get(nearestLocation);

//update Property
router.route("/:id").put(
  upload.fields([
    {
      name: "propertyImage",
      maxCount: 10,
    },
  ]),
  updatePropertyById,
);

//delete Property
router.route("/:id").delete(deletePropertyById);

//get property by user id

router.route("/user/:userId").get(getPropertiesByUserId);
//to get Property by id
router.route("/:id").get(getPropertyById);
//get all Property
router.route("/").get(getAllProperties);

//book property
router.route("/bookings").post(bookProperty);
//cancel booking
router.route("/bookings/:bookingId/cancel").put(cancelBooking);

export default router;
