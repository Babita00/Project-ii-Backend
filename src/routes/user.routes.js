import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
import { loginUser } from "../controllers/user.login.controller.js";
import { logoutUser } from "../controllers/user.logout.controller.js";
import { registerUser } from "../controllers/user.controller.js";
import { verifyJWT } from "../middleware/jwtauth.middleware.js";
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

// Login route
router.route("/login").post(loginUser);

//logout user
router.route("/logout").post(verifyJWT, logoutUser);
export default router;
