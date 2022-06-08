import Listing from "../models/Listing.js";
import asyncHandler from "express-async-handler";
import { BadRequestError, NotFoundError } from "../utils/errorResponse.js";
import { cloudinary } from "../utils/cloudinary.js";

// @desc    Get Listings
// @route   GET /api/v1/listings
// @access  Public
export const getListings = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResponse);
});

// @desc    Get Listing
// @route   GET /api/v1/listings
// @access  Public
export const getListing = asyncHandler(async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);

  if (!listing) {
    return next(new NotFoundError("Listing not found"));
  }

  res.status(200).json({ success: true, listing });
});

// @desc    Create Listing
// @route   POST /api/v1/listings
// @access  Private
export const createListing = asyncHandler(async (req, res, next) => {
  // console.log("Listing data:", req.body.listingData);
  // console.log("Images strings:", req.body.imagesStrs, "User:", req.user);
  const listing = new Listing({
    ...req.body.listingData,
    user: req.user.id,
  });

  const images = [];
  const cloudinary_ids = [];

  const files = req.body.imagesStrs;
  const { urls, types } = files;

  // check if every uploaded file is image
  const areTypesGood = types.map((type) => {
    if (type.startsWith("image")) {
      return true;
    }
    return false;
  });

  if (!areTypesGood.includes(false)) {
    // wait for all images to upload then execute rest part of code
    await Promise.all(
      urls.map(async (url) => {
        let uploadedResponse = await cloudinary.uploader.upload(url, {
          upload_preset: "real-estates",
        });
        images.push(uploadedResponse.secure_url);
        cloudinary_ids.push(uploadedResponse.public_id);
      })
    );

    listing.images = images;
    listing.cloudinary_ids = cloudinary_ids;

    // save listing
    await listing.save();
    res.status(201).json({ success: true, listing });
  } else {
    listing.images = undefined;
    listing.cloudinary_ids = undefined;
    res.status(500).json({ success: true, error: "Could not upload images" });
  }
});
