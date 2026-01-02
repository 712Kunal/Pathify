import express from "express";
import {
  createUserProfile,
  getMyProfile,
  updateUserProfile,
} from "../controller/userProfile.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { profileSchema } from "../vallidators/profile.validator.js";

const router = express.Router();

router.get("/me", authMiddleware, getMyProfile);
router.post(
  "/create",
  authMiddleware,
  validate(profileSchema),
  createUserProfile,
);
router.put(
  "/update",
  authMiddleware,
  validate(profileSchema),
  updateUserProfile,
);

export default router;
