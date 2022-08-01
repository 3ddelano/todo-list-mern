const { Router } = require("express");
const { validate } = require("../../utils/validate");

const validation = require("../../config/validation");
const requireAuth = require("../../utils/requireAuth");
const userCtrl = require("./user.controller");

const router = Router();

router.get("/", requireAuth, userCtrl.getUser);

router.patch(
    "/@me",
    requireAuth,
    validate(validation.modifyUser, {}, { abortEarly: false }),
    userCtrl.modifyUser
);

module.exports = router;
