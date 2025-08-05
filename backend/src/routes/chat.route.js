const express = require("express");
const chatController = require("../controllers/chat.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const { multerMiddleware } = require("../configs/cloudinary.config");

const router = express.Router();

router.post(
  "/send-message",
  authMiddleware,
  multerMiddleware,
  chatController.sendMessage
);
router.get("/conversations", authMiddleware, chatController.getConversation);
router.get(
  "/conversations/:conversationId/messages",
  authMiddleware,
  chatController.getMessages
);
router.put("/messages/read", authMiddleware, chatController.markAsRead);
router.delete(
  "/messages/:messageId",
  authMiddleware,
  chatController.deleteMessage
);

module.exports = router;
