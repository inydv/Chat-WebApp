const jwt = require("jsonwebtoken");
const response = require("../utils/responseHandler.util");

const authMiddleware = (req, res, next) => {
  const authToken = req.cookies?.auth_token;

  if (!authToken)
    return response(
      res,
      401,
      "Authorization token missing. Please provide token"
    );

  try {
    const decode = jwt.verify(authToken, process.env.JWT_SECRET_KEY);
    req.user = decode;
    next();
  } catch (error) {
    console.error("Auth middleware error: ", error);
    return response(res, 401, "Invalid or expired token");
  }
};

module.exports = authMiddleware;
