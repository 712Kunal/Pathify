import { UserProfile } from "../models/Profile.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

export const createUserProfile = async (req, res, next) => {
  try {
    const user_id = req.userId;

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
    const userId = req.userId;

    const profile = await UserProfile.findOne({ user_id: userId }).populate(
      "user_id",
      "username email",
    );

    if (!profile) {
      return next(
        new ApiError(
          404,
          "Profile not found",
          {
            field: "userId",
            value: userId,
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
    const userId = req.userId;
    const profile = await UserProfile.findOne({ user_id: userId });
    if (!profile) {
      return next(
        new ApiError(
          404,
          "Profile not found",
          {
            field: "userId",
            value: userId,
          },
          [],
        ),
      );
    }

    const { personal_info, background, social_links, personal_preferences } =
      req.body;

    // --- PERSONAL INFO ---
    if (personal_info) {
      for (const key in personal_info) {
        // skip undefined keys
        if (personal_info[key] !== undefined) {
          profile.personal_info[key] = personal_info[key];
        }
      }
      // ensure avatar exists
      if (!profile.personal_info.avatar) {
        profile.personal_info.avatar = { url: "", public_id: "" };
      }
    }

    // --- BACKGROUND ---
    if (background) {
      for (const key in background) {
        if (background[key] !== undefined) {
          profile.background[key] = background[key];
        }
      }
    }

    // --- SOCIAL LINKS ---
    if (social_links) {
      for (const key in social_links) {
        if (social_links[key] !== undefined) {
          profile.social_links[key] = social_links[key];
        }
      }
    }

    // --- PREFERENCES ---
    if (personal_preferences) {
      for (const key in personal_preferences) {
        if (personal_preferences[key] !== undefined) {
          profile.personal_preferences[key] = personal_preferences[key];
        }
      }
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
