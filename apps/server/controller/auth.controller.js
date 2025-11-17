import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateToken.js";
import logger from "../utils/logger.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      logger.error(
        { email: req.body.email },
        "User registration failed: User already exists"
      );
      throw new ApiError(400, "User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    // Build a response data
    const responseData = {
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    };

    logger.info({ userId: newUser._id }, "User registration successful");

    // send standardized response
    res.json(new ApiResponse(201, "Registration successful", responseData));
  } catch (error) {
    next(
      error instanceof ApiError
        ? error
        : new ApiError(500, error.message, error.stack, false)
    );
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  const findUser = await User.findOne({ email });
  if (!findUser) {
    logger.error({ email: req.email }, "User does not exist");
    throw new ApiError(404, "User does not exist");
  }

  const isMatch = await bcrypt.compare(password, findUser.password);
  if (!isMatch) {
    logger.error({ email: req.email }, "Password does not match");
    throw new ApiError(400, "Invalid credentials");
  }

  const accessToken = generateAccessToken(findUser._id);
  const refreshToken = generateRefreshToken(findUser._id);

  // store the hashed refresh token in the database
  findUser.refreshToken = await bcrypt.hash(refreshToken, 10);
  await findUser.save();

  // send refresh token as httponly cookie
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  const responseData = {
    user: {
      id: findUser._id,
      accessToken: accessToken,
    },
  };

  res.json(new ApiResponse(201, "Login successful", responseData));
};
