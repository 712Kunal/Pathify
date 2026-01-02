import { z } from "zod";

export const profileSchema = z.object({
  body: z.object({
    // BACKGROUND
    background: z
      .object({
        degree: z.string().optional(),
        experience: z.string().optional(),
        field_of_study: z.string().optional(),

        hobbies: z
          .array(
            z.object({
              text: z.string().min(1, "Hobby text is required"),
            }),
          )
          .optional(),

        interests: z
          .array(
            z.object({
              interest: z.string().min(1, "Interest is required"),
            }),
          )
          .optional(),

        languages_known: z
          .array(
            z.object({
              language: z.string(),
            }),
          )
          .optional(),

        learning_styles: z
          .array(
            z.object({
              learningStyle: z.string(),
            }),
          )
          .optional(),
      })
      .optional(),

    // PERSONAL INFO
    personal_info: z
      .object({
        full_name: z.string().optional(),
        bio: z.string().optional(),
        date_of_birth: z.string().optional(), // ISO string
        gender: z.string().optional(),
        contact: z.string().optional(),
        location: z.string().optional(),
      })
      .optional(),

    // PREFERENCES
    personal_preferences: z
      .object({
        email_notification: z.boolean().optional(),
      })
      .optional(),

    // SOCIAL LINKS
    social_links: z
      .object({
        git: z.string().url().optional(),
        insta: z.string().url().optional(),
        linkedin: z.string().url().optional(),
        portfolio: z.string().url().optional(),
        twitter: z.string().url().optional(),
      })
      .optional(),
  }),

  query: z.object({}).optional(),
  params: z.object({}).optional(),
});
