const express = require("express");
const { validate } = require("../../utils/validate");

const validation = require("../../config/validation");
const authCtrl = require("./auth.controller");

const router = express.Router();

router
    .route("/login")
    .post(
        validate(validation.login, {}, { abortEarly: false }),
        authCtrl.login
    );

router
    .route("/signup")
    .post(
        validate(validation.signup, {}, { abortEarly: false }),
        authCtrl.signup
    );

module.exports = router;
