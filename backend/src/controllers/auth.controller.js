const User = require("../models/user.model");
const Conversation = require("../models/conversation.model");
const sendOtpToEmail = require("../services/email.service");
const otpGenerate = require("../utils/otpGenerate.util");
const response = require("../utils/responseHandler.util");
const twilioService = require("../services/twilio.service");
const generateToken = require("../utils/generateToken.util");
const { uploadFileToCloudinary } = require("../configs/cloudinary.config");

const sendOtp = async (req, res) => {
  const { phoneNumber, phoneSuffix, email } = req.body;

  // Generate OTP
  const otp = otpGenerate();
  const expiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

  let user;

  try {
    if (email) {
      user = await User.findOne({ email });

      if (!user) user = new User({ email });

      user.emailOtp = otp;
      user.emailOtpExpiry = expiry;

      await user.save();

      await sendOtpToEmail(email, otp);

      return response(res, 200, "OTP sent to your email", { email });
    }

    if (!phoneNumber || !phoneSuffix)
      return response(res, 400, "Phone number and phone suffix are required");

    const fullPhoneNumber = `${phoneSuffix}${phoneNumber}`;
    user = await User.findOne({ phoneNumber });

    if (!user) user = new User({ phoneNumber, phoneSuffix });

    await twilioService.sendOtpToPhoneNumber(fullPhoneNumber);

    await user.save();

    return response(res, 200, "Otp sent successfully", user);
  } catch (error) {
    console.error("Send otp error: ", error);
    return response(res, 500, "Internal server error");
  }
};

const verifyOtp = async (req, res) => {
  const { phoneNumber, phoneSuffix, email, otp } = req.body;

  try {
    let user;

    if (email) {
      user = await User.findOne({ email });

      if (!user) return response(res, 404, "User not found");

      const now = new Date();

      if (
        !user.emailOtp ||
        String(user.emailOtp) !== String(otp) ||
        now > new Date(user.emailOtpExpiry)
      )
        return response(res, 400, "Invalid or expired otp");

      user.isVerified = true;
      user.emailOtp = null;
      user.emailOtpExpiry = null;

      await user.save();
    } else {
      if (!phoneNumber || !phoneSuffix)
        return response(res, 400, "Phone number and phone suffix are required");

      const fullPhoneNumber = `${phoneSuffix}${phoneNumber}`;
      user = await User.findOne({ phoneNumber });

      if (!user) return response(res, 404, "User not found");

      const result = await twilioService.verifyOtp(fullPhoneNumber, otp);

      if (result.status !== "approved")
        return response(res, "400", "Invalid otp");

      user.isVerified = true;

      await user.save();
    }

    const token = generateToken(user._id);

    req.cookie("auth_token", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365,
    });

    return response(res, 200, "Otp verified successfully", { token, user });
  } catch (error) {
    console.error("Verify otp error: ", error);
    return response(res, 500, "Internal server error");
  }
};

const updateProfile = async (req, res) => {
  const { username, agreed, about } = req.body;

  const userId = req.user.userId;

  try {
    const user = await User.findById(userId);
    const file = req.file;

    if (file) {
      const uploadResult = await uploadFileToCloudinary(file);
      user.profilePicture = uploadResult?.secure_url;
    } else if (req.body.profilePicture) {
      user.profilePicture = req.body.profilePicture;
    }

    if (username) user.username = username;
    if (agreed) user.agreed = agreed;
    if (about) user.about = about;

    await user.save();

    return response(res, 200, "User profile updated successfully", user);
  } catch (error) {
    console.error("Update profile error: ", error);
    return response(res, 500, "Internal server error");
  }
};

const checkAuthenticated = async (req, res) => {
  try {
    const userId = req.user.userId;

    if (!userId)
      return response(
        res,
        404,
        "Unauthorization! Please login before access our app"
      );

    const user = await User.findById(userId);

    if (!user) return response(res, 404, "User not found");

    return response(res, 200, "User retrived and allow to use app", user);
  } catch (error) {
    console.error("Check authenticated error: ", error);
    return response(res, 500, "Internal server error");
  }
};

const logout = (req, res) => {
  try {
    res.cookie("auth_token", "", { expires: new Date(0) });
    return response(res, 200, "User logout successfully");
  } catch (error) {
    console.error("Logout error: ", error);
    return response(res, 500, "Internal server error");
  }
};

const getAllUsers = async (req, res) => {
  const loggedInUser = req.user.userId;

  try {
    const users = await User.find({ _id: { $ne: loggedInUser } })
      .select(
        "username profilePicture lastSeen isOnline about phoneNumber phoneSuffix"
      )
      .lean();

    const usersWithConversation = await Promise.all(
      users.map(async (user) => {
        const conversation = await Conversation.findOne({
          participants: { $all: [loggedInUser, user?._id] },
        })
          .populate({
            path: "lastMessage",
            select: "content createdAt sender receiver",
          })
          .lean();

        return {
          ...user,
          conversation: conversation | null,
        };
      })
    );

    return response(
      res,
      200,
      "users retived successfully",
      usersWithConversation
    );
  } catch (error) {
    console.error("Get all users error: ", error);
    return response(res, 500, "Internal server error");
  }
};

module.exports = {
  sendOtp,
  verifyOtp,
  updateProfile,
  checkAuthenticated,
  logout,
  getAllUsers,
};
