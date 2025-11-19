import express from "express";
import {
  register,
  login,
  refreshAccessToken,
  logout,
} from "../controller/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/refreshAccessToken", refreshAccessToken);
router.post("/logout", logout);

// example protected route
router.get("/me", authMiddleware, (req, res) => {
  res.json({ message: "Protected route", userId: req.userId });
});

export default router;
