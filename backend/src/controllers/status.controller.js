const { uploadFileToCloudinary } = require("../configs/cloudinary.config");
const Status = require("../models/status.model");
const Message = require("../models/message.model");
const response = require("../utils/responseHandler.util");

exports.createStatus = async (req, res) => {
  try {
    const { content, contentType } = req.body;
    const userId = req.user.userId;
    const file = req.file;

    let mediaUrl = null;
    let finalContentType = contentType || "TEXT";

    if (file) {
      const uploadFile = await uploadFileToCloudinary(file);

      if (!uploadFile.secure_url)
        return response(res, 400, "Failed to upload media");

      mediaUrl = uploadFile?.secure_url;

      if (file.mimetype.startwith("image")) finalContentType = "IMAGE";
      else if (file.mimetype.startwith("video")) finalContentType = "VIDEO";
      else return response(res, 400, "Unsupported file type");
    } else if (content?.trim()) finalContentType = "TEXT";
    else return response(res, 400, "Message content is required");

    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    const status = new Status({
      user: userId,
      content: mediaUrl || content,
      contentType: finalContentType,
      imageOrVideoUrl,
      messageStatus,
    });

    await status.save();

    const populatedStatus = await Message.findOne(status?._id)
      .populate("user", "username profilePicture")
      .populate("viewers", "username profilePicture");

    return response(res, 201, "Status created successfully", populatedStatus);
  } catch (error) {
    console.error("Status create error: ", error);
    return response(res, 500, "Internal server error");
  }
};

exports.getStatuses = async (req, res) => {
  try {
    const statuses = await Status.find({
      expiresAt: { $gt: new Date() },
    })
      .populate("user", "username profilePicture")
      .populate("viewers", "username profilePicture")
      .sort({ createdAt: -1 });

    return response(res, 200, "Statuses retrived successfully", statuses);
  } catch (error) {
    console.error("Get status error: ", error);
    return response(res, 500, "Internal server error");
  }
};

exports.viewStatus = async (req, res) => {
  const { statusId } = req.params;
  const userId = req.user.userId;

  try {
    const status = await Status.findById(statusId);

    if (!status) return response(res, 404, "Status not found");

    if (!status.viewers.includes(userId)) {
      status.viewers.push(userId);
      await status.save();

      const updateStatus = await Status.findById(statusId)
        .populate("user", "username profilePicture")
        .populate("viewers", "username profilePicture");
    } else {
      console.log("User already viewed the status");
    }

    return response(res, 200, "Status viewed successfully", updateStatus);
  } catch (error) {
    console.error("View status error: ", error);
    return response(res, 500, "Internal server error");
  }
};

exports.deleteStatus = async (req, res) => {
  const { statusId } = req.params;
  const userId = req.user.userId;

  try {
    const status = await Status.findById(statusId);

    if (!status) return response(res, 404, "Status not found");

    if (status.user.toString() !== userId)
      return response(res, 403, "Not authorized to delete this status");

    await status.deleteOne();

    return response(res, 200, "Status deleted successfully");
  } catch (error) {
    console.error("Delete status error: ", error);
    return response(res, 500, "Internal server error");
  }
};
