import mongoose from "mongoose";

const UserprofileSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    // BACKGROUND SECTION
    background: {
      degree: { type: String },
      experience: { type: String },
      field_of_study: { type: String },

      hobbies: [
        {
          hobby_id: { type: String, required: true },
          text: { type: String, required: true },
          created_at: { type: Date, default: Date.now },
        },
      ],

      interests: [
        {
          interest_id: { type: String, required: true },
          interest: { type: String, required: true },
          created_at: { type: Date, default: Date.now },
        },
      ],

      languages_known: [
        {
          language_id: { type: String, required: true },
          language: { type: String, required: true },
          created_at: { type: Date, default: Date.now },
        },
      ],

      learning_styles: [
        {
          learningStyle_id: { type: String, required: true },
          learningStyle: { type: String, required: true },
          created_at: { type: Date, default: Date.now },
        },
      ],

      created_at: { type: Date, default: Date.now },
      updated_at: { type: Date, default: Date.now },
    },

    // PERSONAL INFO SECTION
    personal_info: {
      full_name: { type: String },
      bio: { type: String },
      date_of_birth: { type: Date },
      gender: { type: String },
      contact: { type: String },
      location: { type: String },
      avatar: { type: String },

      created_at: { type: Date, default: Date.now },
      updated_at: { type: Date, default: Date.now },
    },

    // PREFERENCES SECTION
    personal_preferences: {
      email_notification: { type: Boolean, default: true },
      created_at: { type: Date, default: Date.now },
      updated_at: { type: Date, default: Date.now },
    },

    // SOCIAL LINKS SECTION
    social_links: {
      git: { type: String },
      insta: { type: String },
      linkedin: { type: String },
      portfolio: { type: String },
      twitter: { type: String },

      created_at: { type: Date, default: Date.now },
      updated_at: { type: Date, default: Date.now },
    },

    // EMAIL VERIFICATION DATA
    verification_data: {
      email_verified: { type: Boolean, default: false },
      email_verification_token: { type: String },
      email_verification_expiration: { type: Date },
      verified_at: { type: Date },

      created_at: { type: Date, default: Date.now },
      updated_at: { type: Date, default: Date.now },
    },
  },
  {
    timestamps: true,
  },
);

export const UserProfile = mongoose.model("UserProfile", UserprofileSchema);
