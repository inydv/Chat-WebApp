const twilio = require("twilio");

const TWILIO_SERVICE_SID = process.env.TWILIO_SERVICE_SID;
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;

const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

const sendOtpToPhoneNumber = async (phoneNumber) => {
  try {
    if (!phoneNumber) throw new Error("Phone number is required");

    const response = await client.verify.v2
      .services(TWILIO_SERVICE_SID)
      .verifications.create({
        to: phoneNumber,
        channel: "sms",
      });

    return response;
  } catch (error) {
    console.error("Twilio error: ", error);
    throw new Error("Failed to send otp");
  }
};

const verifyOtp = async (phoneNumber, otp) => {
  try {
    const response = await client.verify.v2
      .services(TWILIO_SERVICE_SID)
      .verificationChecks.create({
        to: phoneNumber,
        code: otp,
      });

    return response;
  } catch (error) {
    console.error("Twilio error: ", error);
    throw new Error("Failed to validate otp");
  }
};

module.exports = {
  sendOtpToPhoneNumber,
  verifyOtp,
};
