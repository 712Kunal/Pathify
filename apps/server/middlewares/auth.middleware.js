import jwt from "jsonwebtoken";
import logger from "../utils/logger.js";
import ApiError from "../utils/ApiError.js";

// FLOW -->
// Login → accessToken returned in JSON → store in memory
//        refreshToken stored in HttpOnly cookie

// Requests → send accessToken in Authorization header

// If accessToken expired → call /refresh → new accessToken

// Logout → clear refreshToken cookie + remove stored accessToken

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Authorization: Bearer <accessToken>

  if (!authHeader) {
    logger.error("No token provided");
    throw new ApiError(401, "No token provided");
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    next(
      error instanceof ApiError
        ? error
        : new ApiError(403, error.message, error.stack, false)
    );
  }
};
