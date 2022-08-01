const { createLogger, format, transports } = require("winston");

const logger = createLogger({
    level: process.env.NODE_ENV == "production" ? "info" : "debug",
    format: format.combine(
        format.timestamp({
            format: "YYYY-MM-DD HH:mm:ss",
        }),
        format.errors({ stack: true }),
        format.splat(),
        format.json()
    ),
    defaultMeta: { service: "backend" },
    transports: [
        new transports.Console({
            level: process.NODE_ENV == "production" ? "info" : "debug",
            format: format.combine(
                format.colorize(),
                format.simple(),
                format.timestamp(),
                format.printf(
                    (info) =>
                        `[${info.service}][${info.timestamp}] ${info.level}: ${info.message}`
                )
            ),
        }),
    ],
});

process.on("uncaughtException", (err) => {
    logger.error(err);
    process.exit(1);
});

process.on("unhandledRejection", (err) => {
    logger.error(err);
    process.exit(1);
});

module.exports = logger;
