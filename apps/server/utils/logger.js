import pino from "pino";
import chalk from "chalk";

const getCaller = () => {
  const stack = new Error().stack.split("\n");
  const callerLine = stack[3] || stack[2];

  const match = callerLine.match(/\((.*):(\d+):(\d+)\)/);
  if (!match) return "unknown";

  const fullPath = match[1];
  const line = match[2];
  const col = match[3];

  const shortPath = fullPath.split("Pathify/apps/")[1] || fullPath;

  return `FILE:${shortPath} LINE:${line} COL:${col}`;
};


const colorCaller = (caller) =>
  chalk.bold(chalk.underline(chalk.magentaBright(`${caller}`)));

const logger = pino({
  level: process.env.LOG_LEVEL || "info",
  base: null,
  transport:
    process.env.NODE_ENV !== "production"
      ? {
          target: "pino-pretty",
          options: {
            colorize: true,
            translateTime: true,
            singleLine: false,
          },
        }
      : undefined,
});

export default {
  info: (msg, meta = {}) => {
    const caller = getCaller();
    logger.info({ caller: colorCaller(caller), ...meta }, msg);
  },

  error: (msg, meta = {}) => {
    const caller = getCaller();
    logger.error({ caller: colorCaller(caller), ...meta }, msg);
  },

  child: (obj) => logger.child(obj),
};
