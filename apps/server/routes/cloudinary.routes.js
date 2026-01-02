import express from "express";
import upload from "../middlewares/multer.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { updateAvatar } from "../controller/cloudinary.controller.js";

const router = express.Router();

router.patch(
  "/update-avatar",
  authMiddleware,
  upload.single("avatar"),
  updateAvatar,
);

export default router;
