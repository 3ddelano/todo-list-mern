const express = require("express");
const cors = require("cors");
const util = require("util");
const path = require("path");
const expressValidation = require("express-validation");

require("./src/config/env");
const logger = require("./src/config/winston");
const mongo = require("./src/config/mongo");
const apiRouter = require("./src/routes");
const APIError = require("./src/utils/APIError");

const corsOptions = {
    origin: (origin, callback) => {
        callback(null, true);
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: [
        "Access-Control-Allow-Origin",
        "Origin",
        "X-Requested-With",
        "Content-Type",
        "Accept",
        "Authorization",
    ],
    credentials: true,
};

const app = express();
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV == "production") {
    // automatically redirect http to https
    app.use((req, res, next) => {
        if (req.headers["x-forwarded-proto"] !== "https") {
            return res.redirect(
                ["https://", req.get("Host"), req.url].join(""),
            );
        }
        return next();
    });
}

app.use("/api", apiRouter);
app.use(express.static("public"));
app.use((req, res, next) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Catch errors
app.use((err, req, res, next) => {
    let apiError = new APIError("Internal server error.", 500, true);
    if (err instanceof SyntaxError) {
        apiError = new APIError("Syntax error. " + err.message, 400, true);
    } else if (err instanceof expressValidation.ValidationError) {
        const unifiedErrors = [];
        if (err.details.params) unifiedErrors.push(...err.details.params);
        if (err.details.body) unifiedErrors.push(...err.details.body);

        const unifiedErrorMessage = unifiedErrors
            .map(error => error.message)
            .join(" and ");

        apiError = new APIError(unifiedErrorMessage, 400, true);
    } else if (!(err instanceof APIError)) {
        apiError = new APIError(err.message, err.status, err.isPublic);
    } else if (err instanceof APIError) {
        apiError = err;
    }

    let statusCode = apiError.status || 500;
    let message = apiError.message;
    if (!apiError.isPublic) {
        statusCode = 500;
        message = "Internal Server Error";
    }
    res.locals.errorMessage = apiError.message;

    logger.error(util.inspect(err));

    res.status(statusCode).json({
        code: statusCode,
        message,
    });
});

(async () => {
    await mongo.connect();

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        logger.info(`Server is running on port ${PORT}.`);
    });
})();
