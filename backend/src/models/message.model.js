const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    conversation: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Conversation",
        required: true,
      },
    ],
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
    },
    imageOrVideoUrl: {
      type: String,
    },
    contentType: {
      type: String,
      enum: ["IMAGE", "VIDEO", "TEXT"],
    },
    reactions: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        emoji: String,
      },
    ],
    messageStatus: {
      type: String,
      default: "SEND",
    },
  },
  {
    timeseries: true,
    timestamps: true,
  }
);

const Message = mongoose.model("Message", messageSchema);
module.exports = Message;
