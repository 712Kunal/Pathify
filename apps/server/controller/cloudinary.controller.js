import { UserProfile } from "../models/Profile.model.js";
import cloudinary from "../config/cloudinary.config.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import streamifier from "streamifier";

export const updateAvatar = async (req, res, next) => {
  try {
    const userId = req.userId;
    const file = req.file;

    if (!file) {
      return next(
        new ApiError(
          400,
          "Image file missing",
          {
            field: "file",
            value: file,
          },
          [],
        ),
      );
    }

    const profile = await UserProfile.findOne({ user_id: userId });
    if (!profile) {
      return next(
        new ApiError(
          400,
          "Profile not found",
          {
            field: "User id",
            value: userId,
          },
          [],
        ),
      );
    }

    profile.personal_info = profile.personal_info || {};

    // delete old avatar
    if (profile.personal_info.avatar?.public_id) {
      await cloudinary.uploader.destroy(profile.personal_info.avatar.public_id);
    }

    // upload buffer to cloudinary
    const uploadFromBuffer = () =>
      new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "avatar",
            public_id: `user_${userId}_avatar`,
            overwrite: true,
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          },
        );

        streamifier.createReadStream(file.buffer).pipe(stream);
      });

    const uploaded = await uploadFromBuffer();

    profile.personal_info.avatar = {
      url: uploaded.secure_url,
      public_id: uploaded.public_id,
    };

    await profile.save();

    const responseData = {
      avatar: profile.personal_info.avatar,
    };

    res.json(new ApiResponse(200, "Avatar updated successfully", responseData));
  } catch (error) {
    next(
      error instanceof ApiError
        ? error
        : new ApiError(500, error.message, error.stack, false),
    );
  }
};
