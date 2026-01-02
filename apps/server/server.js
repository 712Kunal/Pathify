import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import logger from "./utils/logger.js";
import ApiResponse from "./utils/ApiResponse.js";

import connectDB from "./config/db.js";

// load environment variables from .env file
dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(helmet());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

// Database connection
connectDB();

import errorMiddleware from "./middlewares/error.middleware.js";
import authRoutes from "./routes/auth.routes.js";
import profileRoutes from "./routes/profile.routes.js";
import cloudinaryRoute from "./routes/cloudinary.routes.js";

//Health-check
app.get("/", (req, res) => {
  res.json(new ApiResponse(200, "Server is running successfully"));
});

//public routes
app.use("/api/auth", authRoutes);

//private routes
app.use("/api/cloudinary", cloudinaryRoute);
app.use("/api/user/profile", profileRoutes);

// Mount the global error handler LAST
app.use(errorMiddleware);

// Error handling for unhandled rejections
process.on("unhandledRejection", (reason, promise) => {
  logger.error(
    {
      promise,
      reason,
      type: "unhandledRejection",
    },
    "Unhandled Promise Rejection occurred",
  );
});

//Server listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  logger.info(`Server running on http://localhost:${PORT}`);
});
