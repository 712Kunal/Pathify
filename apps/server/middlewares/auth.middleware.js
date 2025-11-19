import jwt from "jsonwebtoken";
import logger from "../utils/logger.js";
import ApiError from "../utils/ApiError.js";

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

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
