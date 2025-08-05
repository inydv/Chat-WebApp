const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    phoneNumber: {
      type: String,
      unique: true,
      sparse: true, // Don't Check For Null
    },
    phoneSuffix: {
      type: String,
    },
    userName: {
      type: String,
    },
    email: {
      type: String,
      lowercase: true,
      unique: true,
      validate: {
        validator: function (value) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        },
        message: "Invalid email address format",
      },
    },
    emailOtp: {
      type: String,
    },
    emailOtpExpiry: {
      type: Date,
    },
    profilePicture: {
      type: String,
    },
    about: {
      type: String,
    },
    lastSeen: {
      type: Date,
    },
    isOnline: {
      type: Boolean,
      default: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    agreed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timeseries: true,
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
