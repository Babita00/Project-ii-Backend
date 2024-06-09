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
  addBooking,
  cancelBooking,
} from "../controllers/bookProperty.controller.js";
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

//update Property
router.route("/:id").put(updatePropertyById);

//delete Property
router.route("/:id").delete(deletePropertyById);

//to get Property by id
router.route("/:id").get(getPropertyById);
//get all Property
router.route("/").get(getAllProperties);
//search Property
router.route("/searchProperty").get(searchProperty);
//book property
router.post("/bookings", addBooking);
//cancel pooking
router.put("/bookings/:bookingId/cancel", cancelBooking);
export default router;
