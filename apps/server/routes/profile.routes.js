import express from "express";
import {
  createUserProfile,
  getMyProfile,
  updateUserProfile,
} from "../controller/userProfile.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/create", authMiddleware, createUserProfile);
router.get("/me", authMiddleware, getMyProfile);
router.put("/update", authMiddleware, updateUserProfile);

export default router;
