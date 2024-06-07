import express from "express";
import { upload } from "../middleware/multer.middleware.js";
import { addProduct } from "../controllers/addProduct.controller.js";
import { updateProductById } from "../controllers/updateProduct.controller.js";
import { deleteProductById } from "../controllers/deleteProduct.controller.js";
import {
  getAllProducts,
  getProductById,
} from "../controllers/fetchProduct.controller.js";
import { searchProducts } from "../controllers/serchProduct.controller.js";
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
router.route("/:id").put(updateProductById);

//delete product
router.route("/:id").delete(deleteProductById);

//to get products by id
router.route("/:id").get(getProductById);
//get all product
router.route("/").get(getAllProducts);
//searchproduct
router.route("/searchProduct").get(searchProducts);
export default router;
