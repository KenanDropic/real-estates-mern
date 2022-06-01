import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add a name"],
  },
  email: {
    type: String,
    required: [true, "Please add a name"],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please add a valid email",
    ],
  },
  password: {
    type: String,
    required: [true, "Please add a password"],
    match: [
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,}$/,
      "Must contain at least 6 characters,uppercase,lowercase letter,special character and number",
    ],
  },
  isEmailConfirmed: {
    type: Boolean,
    default: false,
  },
  confirmEmailToken: String,
  confirmEmailExpire: Date,
  role: {
    type: String,
    enum: ["user", "publisher", "admin"],
    default: user,
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

export default mongoose.model("User", UserSchema);
