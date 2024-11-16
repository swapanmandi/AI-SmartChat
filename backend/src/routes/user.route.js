import { Router } from "express";
import {
  signupUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  getCurrentUser,
  authRoute,
  userList,
  getUser
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";



const router = Router();

router.route("/signup").post(signupUser);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-access-token").post(refreshAccessToken);
router.route("/currentUser").get(verifyJWT, getCurrentUser);
router.route("/authStatus").get(verifyJWT, authRoute);
router.route("/list").get(verifyJWT, userList)
router.route("/user/:id").get(verifyJWT, getUser)


export default router;
