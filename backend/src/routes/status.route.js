const express = require("express");
const statusController = require("../controllers/status.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const { multerMiddleware } = require("../configs/cloudinary.config");

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  multerMiddleware,
  statusController.createStatus
);
router.get("/", authMiddleware, statusController.getStatuses);
router.put("/:statusId/view", authMiddleware, statusController.viewStatus);
router.delete("/:statusId", authMiddleware, statusController.deleteStatus);

module.exports = router;
