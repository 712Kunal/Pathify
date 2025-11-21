import ApiError from "../utils/ApiError.js";
import chalk from "chalk";

const errorMiddleware = (err, req, res, next) => {
  // Convert unknown errors to ApiError
  if (!(err instanceof ApiError)) {
    err = new ApiError(
      err.statusCode || 500,
      err.message || "Internal Server Error",
      err.details || null,
      false,
      err.stack,
    );
  }

  // Extract actual caller (correct source of error)
  const stackLines = err.stack.split("\n");
  const callerLine = stackLines[2] || stackLines[1];
  let file = "unknown";
  let line = "0";
  let col = "0";

  const match = callerLine.match(/\((.*):(\d+):(\d+)\)/);
  if (match) {
    const fullPath = match[1];
    const shortPath = fullPath.split("Pathify/apps/server")[1] || fullPath;
    file = shortPath;
    line = match[2];
    col = match[3];
  }

  const methodRouteLine =
    `${chalk.magenta("METHOD:")} ${chalk.cyan(req.method)}  ` +
    `${chalk.magenta("ROUTE:")} ${chalk.cyan(req.originalUrl)}`;

  // build a clean formatted log
  const logOutput = `
    ${chalk.red.bold("ERROR")} ${chalk.white(err.message)}
        ${chalk.yellow("File:    ")} ${chalk.cyan(`${file}:${line}:${col}`)}
        ${chalk.yellow("Request:  ")}${methodRouteLine}
        ${chalk.yellow("Req-ID:  ")} ${chalk.cyan(req.id)}
        ${chalk.yellow("Details: ")} ${chalk.cyan(err.details || "null")}
        ${chalk.yellow("Stack:   ")} 
    ${chalk.gray(err.stack)}
    `;

  // log clean error
  console.log(logOutput);

  // continue JSON response to client
  return res.status(err.statusCode).json({
    success: false,
    message: err.message || "Internal server error",
    details: err.details || null,
    errors: err.errors || [],
  });
};

export default errorMiddleware;
