import UserProfile from "../models/Profile.model";
import cloudinary from "../config/cloudinary.config";
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";
import fs from "fs";
import { url } from "inspector";

export const updateAvatar = async (req, res, next) => {
  try {
    const userId = req.user.id;
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

    // remove old avatar if exist
    if (profile.personal_info.avatar?.public_id) {
      await cloudinary.uploader.destroy(`avatars/${public_id}`);
    }

    // upload new avatar to cloudinary
    const uploaded = await cloudinary.uploader.upload(file.path, {
      folder: "avatar",
      public_id: `user_${userId}_avatar`,
    });

    // remove temp uploaded file
    fs.unlinkSync(file.path);

    // update user avatar in db
    profile.personal_info.avatar = {
      url: uploaded.secure_url,
      public_id: uploaded.public_id,
    };
    await profile.save();

    const responseData = {
      avatar: profile.avatar,
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
