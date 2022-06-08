import express from "express";
import { createListing, getListings } from "../controllers/listings.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

router.route("/").get(getListings).post(authenticate, createListing);

export default router;
