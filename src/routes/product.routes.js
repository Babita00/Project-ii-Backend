import express from "express";
import { addProduct } from "../controllers/product.controller.js";
import { addProduct } from "../controllers/addProduct.controller.js";
import { updateProductById } from "../controllers/updateProduct.controller.js";
import { deleteProductById } from "../controllers/deleteProduct.js";

const router = express.Router();

//add product
router.route("/add").post(
  upload.fields([
    {
      name: "productImage",
      macCount: 10,
    },
  ]),
  addProduct,
);

//update Product
router.route("/update").post(updateProductById);

//delete product
router.route("/delete").post(deleteProductById);

export default router;
