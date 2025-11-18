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
  try {
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
  } catch (error) {
    next(
      error instanceof ApiError
        ? error
        : new ApiError(500, error.message, error.stack, false)
    );
  }
};

export const refreshAccess = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;

    if (!token) {
      logger.error({ RefreshToke: token }, "Token not found");
      throw new ApiError(401, "No refresh token");
    }

    // token format validation
    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

    const user = await User.findById(decoded.userId);
    if (!user) {
      logger.error({ User: user }, "User not found");
      throw new ApiError(401, "User not found");
    }

    const isValid = await bcrypt.compare(token, user.refreshToken);
    if (!isValid) {
      logger.error({ token: token }, "Not valid token");
      throw new ApiError(401, "Invalid refresh token");
    }

    // generate new access and refresh token
    const newAccessToken = generateAccessToken(user._id);
    const newRefreshToken = generateRefreshToken(user._id);

    // update the existing user's refresh token
    user.refreshToken = await bcrypt.hash(newRefreshToken, 10);
    await user.save();

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });

    const responseData = {
      accessToken: newAccessToken,
    };

    res.json(
      new ApiResponse(201, "New access token regenerated", responseData)
    );
  } catch (error) {
    next(
      error instanceof ApiError
        ? error
        : new ApiError(401, error.message, error.stack, false)
    );
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("refreshToken");

    // remove refresh token from DB
    const user = await User.findById(req.body.userId);
    if (user) {
      user.refreshToken = "";
      await user.save();
    }

    res.json(new ApiResponse(200, "Logged out successfully"));
  } catch (error) {
    next(
      error instanceof ApiError
        ? error
        : new ApiError(500, error.message, error.stack, false)
    );
  }
};
