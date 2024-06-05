import express from "express";
import { upload } from "../middleware/multer.middleware.js";
import { addProduct } from "../controllers/addProduct.controller.js";
import { updateProductById } from "../controllers/updateProduct.controller.js";
import { deleteProductById } from "../controllers/deleteProduct.controller.js";
import {
  getAllProducts,
  getProductById,
} from "../controllers/fetchProduct.controller.js";
const router = express.Router();

//add product
router.route("/add").post(
  upload.fields([
    {
      name: "productImage",
      maxCount: 10,
    },
  ]),
  addProduct,
);

//update Product
router.route("/update").post(updateProductById);

//delete product
router.route("/delete").delete(deleteProductById);

//to get all products
router.route("/getProduct").get(getAllProducts, getProductById);

export default router;
