const express = require("express");
const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const { multerMiddleware } = require("../configs/cloudinary.config");

const router = express.Router();

router.post("/send-otp", authController.sendOtp);
router.post("/verify-otp", authController.verifyOtp);
router.post("/logout", authMiddleware, authController.logout);
router.put(
  "/update-profile",
  authMiddleware,
  multerMiddleware,
  authController.verifyOtp
);
router.get("/check-auth", authMiddleware, authController.checkAuthenticated);
router.get("/users", authMiddleware, authController.getAllUsers);

module.exports = router;
