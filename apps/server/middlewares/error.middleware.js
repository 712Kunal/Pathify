import ApiError from "../utils/ApiError.js";
import logger from "../utils/logger.js";
import chalk from "chalk";

const errorMiddleware = async (err, req, res, next) => {
  // convert unknown errors
  if (!(err instanceof ApiError)) {
    err = new ApiError(
      err.statusCode || 500,
      err.message || "Internal Server Error",
      err.details || null,
      false,
      err.stack
    );
  }

  const stack = err.stack.split("\n");

  // index 2 = actual place where error originated
  const callerLine = stack[2] || stack[1];

  const match = callerLine.match(/\((.*):(\d+):(\d+)\)/);
  let caller = "unknown";

  if (match) {
    const fullPath = match[1];
    const line = match[2];
    const col = match[3];

    const shortPath = fullPath.split("Pathify/apps/server")[1] || fullPath;

    caller = `FILE:${shortPath} LINE:${line} COL:${col}`;
  }

  const colorCaller = (caller) =>
    chalk.bold(chalk.underline(chalk.magentaBright(`${caller}`)));

  logger.error(err.message, {
    caller: colorCaller(caller),
    stack: err.stack,
    details: err.details,
    errors: err.errors,
  });

  return res.status(err.statusCode).json({
    success: false,
    message: err.message,
    details: err.details || null,
    errors: err.errors || [],
  });
};

export default errorMiddleware;
