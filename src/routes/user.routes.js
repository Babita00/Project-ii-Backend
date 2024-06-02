import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
import { loginUser } from "../controllers/user.login.controller.js";
import { logoutUser } from "../controllers/user.logout.controller.js";
import { verifyJWT } from "../middleware/jwtauth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";
import { changeCurrentPassword } from "../controllers/user.changePassword.js";
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
router.route("/logout").post(logoutUser);

//verify jwt
router.route("/verifyjwt").post(verifyJWT);

//change password
router.route("/passwordchange").post(changeCurrentPassword);

export default router;
