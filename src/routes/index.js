const { Router } = require("express");
const APIError = require("../utils/APIError");

const router = Router();

router.get("/", (req, res) => {
    res.json({
        message: "Server is online!",
    });
});

router.use("/auth/", require("./auth/auth.routes"));
router.use("/users/", require("./user/user.routes"));
router.use("/todos/", require("./todo/todo.routes"));

// API 404 Handler
router.all("*", (req, res, next) => {
    const err = new APIError("API Endpoint Not Found", 404, true);
    return next(err);
});

module.exports = router;
