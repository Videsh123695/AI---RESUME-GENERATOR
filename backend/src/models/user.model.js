const mongoose = require("mongoose");
const { lowercase } = require("zod");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: [true, "username already taken"],
      required: true,
      unique: true,

      trim: true,

      minlength: [3, "Username must be at least 3 characters"],
    },

    email: {
      type: String,
      unique: [true, "Account already exists with this email address"],
      required: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },
  },
  {
    timestamps: true,
  },
);

const userModel = mongoose.model("users", userSchema);

module.exports = userModel;
