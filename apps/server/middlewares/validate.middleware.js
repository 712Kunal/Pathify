import { ZodError } from "zod";
import ApiError from "../utils/ApiError.js";

export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse({
    body: req.body,
    query: req.query,
    params: req.params,
  });

  if (!result.success) {
    const details = result.error.issues.map((e) => ({
      path: e.path.join("."),
      message: e.message,
    }));

    return next(new ApiError(422, "Validation failed", details));
  }

  req.validated = result.data;

  next();
};
