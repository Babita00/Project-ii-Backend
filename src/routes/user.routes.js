import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
import { upload } from "../middleware/multer.middleware.js";

const router = Router();

// Register route

router.route("/register").post(
  upload.fields([
    {
      name: "coverImage",
      macCount: 1,
    },
  ]),

  registerUser,
);
export default router;
