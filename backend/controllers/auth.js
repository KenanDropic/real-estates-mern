import mongoose from "mongoose";
import User from "../models/User.js";
import asyncHandler from "express-async-handler";
import {
  BadRequestError,
  NotFoundError,
  UnAuthenticatedError,
} from "../utils/errorResponse.js";
import crypto from "crypto";
import { cloudinary } from "../utils/cloudinary.js";

// @desc    Register User
// @route   POST /api/v1/auth/register
// @access  Public
export const registerUser = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return next(new BadRequestError("Please provide all values"), 400);
  }

  const doesUserExist = await User.findOne({ email });

  if (doesUserExist) {
    return next(new BadRequestError("User already exists"), 400);
  }

  const user = await new User(req.body).save();

  sendTokenResponse(user, 201, res, "");
});

// @desc    Login User
// @route   POST /api/v1/auth/login
// @access  Public
export const loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new BadRequestError("Please provide all values"));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new NotFoundError("User not found"));
  }

  const match = await user.matchPasswords(password);

  if (!match) {
    return next(new UnAuthenticatedError("Invalid credentials"));
  }

  sendTokenResponse(user, 200, res, "");
});

// @desc    Get current user
// @route   GET /api/v1/auth/me
// @access  Private
export const getLoggedUser = asyncHandler(async (req, res, next) => {
  const currentUser = await User.findById(req.user.id);

  if (!currentUser) {
    return next(new NotFoundError("User not found"));
  }

  // removing __v property
  const currentUserCopy = {
    _id: currentUser._id,
    name: currentUser.name,
    email: currentUser.email,
    role: currentUser.role,
    phone: currentUser.phone,
    avatar: currentUser?.avatar,
    cloudinary_id: currentUser?.cloudinary_id,
    isEmailConfirmed: currentUser.isEmailConfirmed,
  };

  res.status(200).json({ success: true, user: currentUserCopy });
});

// @desc    Update user
// @route   GET /api/v1/auth/me
// @access  Private
export const updateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    return next(new NotFoundError("User not found"));
  }

  res.status(200).json({ success: true });
});

// @desc    Upload user avatar
// @route   PUT /api/v1/auth/upload
// @access  Private
export const uploadAvatar = asyncHandler(async (req, res, next) => {
  const fileStr = req.body.data;
  const user = await User.findById(req.user.id);
  if (!user) {
    return next(new NotFoundError("User not found"));
  }
  // first delete previous image based on old cloudinary_id,then upload new one and update cloudinary_id and avatar in db
  try {
    await cloudinary.uploader.destroy(req.user.cloudinary_id, async () => {
      const uploadedResponse = await cloudinary.uploader.upload(fileStr, {
        upload_preset: "real-estates",
      });
      user.avatar = uploadedResponse.secure_url;
      user.cloudinary_id = uploadedResponse.public_id;
      await user.save();
    });
    res.status(201).json({ success: true });
  } catch (error) {
    res.status(500).json({ success: true, error: error.message });
  }
});

// send token as response
const sendTokenResponse = (user, statusCode, response, msg) => {
  const token = user.getSignedJWT();

  response
    .status(statusCode)
    .json({ success: true, token, message: msg !== "" ? msg : undefined });
};
