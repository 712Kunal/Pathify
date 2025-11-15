import pino from "pino";

const logger = pino({
  level: process.env.LOG_LEVEL || "info",
  base: null,
  transport:
    process.env.NODE_ENV !== "production"
      ? {
          target: "pino-pretty",
          options: { colorize: true, translateTime: true },
        }
      : undefined,
});

export default {
  info: (msg, meta) => logger.info(meta || {}, msg),
  error: (msg, meta) =>
    logger.error(
      meta || {},
      msg || (meta && meta.message ? meta.message : "error")
    ),
  child: (buildings) => logger.child(buildings),
};
