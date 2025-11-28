import express from "express";
import upload from "../middlewares/multer.middleware";
import authMiddleware from "../middlewares/auth.middleware";
import { updateAvatar } from "../controller/cloudinary.controller";

const router = express.Router();

router.patch(
  "/update-avatar",
  authMiddleware,
  upload.single("avatar"),
  updateAvatar,
);

export default router;
