import express from "express";
import {
  getLoggedUser,
  loginUser,
  registerUser,
  updateUser,
  uploadAvatar,
} from "../controllers/auth.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/me").get(authenticate, getLoggedUser);
router.route("/upload").post(authenticate, uploadAvatar);
router.route("/").put(authenticate, updateUser);

export default router;
