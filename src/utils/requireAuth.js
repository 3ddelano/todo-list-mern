const jwt = require("jsonwebtoken");
const logger = require("../config/winston");
const User = require("../models/user.model");
const APIError = require("./APIError");

const requireAuth = async (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization)
        return next(new APIError("Missing authorization header.", 401, true));

    // Parse the Bearer token from the authorization header
    const parts = authorization.trim().split(" ");
    if (parts.length != 2 || parts[0].toLowerCase() !== "bearer")
        return next(new APIError())(
            "Invalid authorization header. Missing bearer token.",
            401,
            true
        );

    try {
        const decoded = jwt.verify(parts[1], process.env.JWT_SECRET);

        const user = await User.findById(decoded._id).select("_id");
        if (!user) return next(new APIError("User not found", 404, true));

        req.user = decoded;
    } catch (err) {
        logger.error(err);
        return next(new APIError("Invalid authorization token.", 401, true));
    }

    next();
};

module.exports = requireAuth;
