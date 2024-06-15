import express from "express";
import { upload } from "../middleware/multer.middleware.js";
import { addProperty } from "../controllers/addProperty.controller.js";
import { updatePropertyById } from "../controllers/updateProperty.controller.js";
import { deletePropertyById } from "../controllers/deleteProperty.controller.js";
import {
  getAllProperties,
  getPropertyById,
} from "../controllers/fetchProperty.controller.js";
import { searchProperty } from "../controllers/serchProperty.controller.js";
import {
  bookProperty,
  cancelBooking,
} from "../controllers/bookProperty.controller.js";

import {
  initializePayment,
  completePayment,
} from "../controllers/payment.controller.js";

import { nearestLocation } from "../controllers/nearestlocationRecommendation.controller.js";
const router = express.Router();

//add product
router.route("/add").post(
  upload.fields([
    {
      name: "propertyImage",
      maxCount: 10,
    },
  ]),
  addProperty,
);

//search Property
router.route("/searchProperty").get(searchProperty);

//nearest location
router.route("/nearest").get(nearestLocation);

//update Property
router.route("/:id").put(updatePropertyById);

//delete Property
router.route("/:id").delete(deletePropertyById);

//to get Property by id
router.route("/:id").get(getPropertyById);
//get all Property
router.route("/").get(getAllProperties);

//book property
router.route("/bookings").post(bookProperty);
//cancel pooking
router.route("/bookings/:bookingId/cancel").put(cancelBooking);
//initialize paymrnt
router.route("/initialize-payment").post(initializePayment);
//complete payment
router.route("/complete-payment").post(completePayment);

export default router;
