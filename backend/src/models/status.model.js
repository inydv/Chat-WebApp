const mongoose = require("mongoose");

const statusSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: { type: String },
    contentType: {
      type: String,
      enum: ["IMAGE", "VIDEO", "TEXT"],
      default: "TEXT",
    },
    viewers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timeseries: true,
    timestamps: true,
  }
);

const Status = mongoose.model("Status", statusSchema);
module.exports = Status;
