import { UserProfile } from "../models/Profile.model";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";

export const createUserProfile = async (req, res, next) => {
  try {
    const user_id = req.user._id;

    // check if already exist
    const existingProfile = await UserProfile.findOne({ user_id });

    if (existingProfile) {
      return next(
        new ApiError(
          400,
          "Profile already exist",
          {
            field: "userId",
            value: user_id,
          },
          [],
        ),
      );
    }

    const profile = await UserProfile.create({
      user_id,
      background: req.body.background || {},
      personal_info: req.body.personal_info || {},
      personal_preferences: req.body.personal_preferences || {},
      social_links: req.body.social_links || {},
    });

    res.json(new ApiResponse(200, "Profile created successfully", profile));
  } catch (error) {
    next(
      error instanceof ApiError
        ? error
        : new ApiError(500, error.message, error.stack, false),
    );
  }
};

export const getMyProfile = async (req, res, next) => {
  try {
    const user_Id = req.user._id;

    const profile = await UserProfile.findOne({ user_Id }).populate(
      "user_Id",
      "username email",
    );

    if (!profile) {
      return next(
        new ApiError(
          404,
          "Profile not found",
          {
            field: "userId",
            value: user_Id,
          },
          [],
        ),
      );
    }

    res.json(new ApiResponse(200, "Profile fetched successfully", profile));
  } catch (error) {
    next(
      error instanceof ApiError
        ? error
        : new ApiError(500, error.message, error.stack, false),
    );
  }
};

export const updateUserProfile = async (req, res, next) => {
  try {
    const user_Id = req.user._id;

    const profile = await UserProfile.findOne({ user_Id });
    if (!profile) {
      return next(
        new ApiError(
          404,
          "Profile not found",
          {
            field: "userId",
            value: user_Id,
          },
          [],
        ),
      );
    }

    if (req.body.background) {
      profile.background = {
        ...profile.background,
        ...req.body.background,
        updated_at: new Date(),
      };
    }

    if (req.body.personal_info) {
      profile.personal_info = {
        ...profile.personal_info,
        ...req.body.personal_info,
        updated_at: new Date(),
      };
    }

    if (req.body.personal_preferences) {
      profile.personal_preferences = {
        ...profile.personal_preferences,
        ...req.body.personal_preferences,
        updated_at: new Date(),
      };
    }

    if (req.body.social_links) {
      profile.social_links = {
        ...profile.social_links,
        ...req.body.social_links,
        updated_at: new Date(),
      };
    }

    await profile.save();

    res.json(new ApiResponse(200, "Profile updated successfully", profile));
  } catch (error) {
    next(
      error instanceof ApiError
        ? error
        : new ApiError(500, error.message, error.stack, false),
    );
  }
};
