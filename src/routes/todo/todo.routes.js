const { Router } = require("express");
const { validate } = require("../../utils/validate");

const validation = require("../../config/validation");
const requireAuth = require("../../utils/requireAuth");
const todoCtrl = require("./todo.controller");

const router = Router();

router.get("/", requireAuth, todoCtrl.getTodos);

router.post(
    "/",
    requireAuth,
    validate(validation.addTodo, {}, { abortEarly: false }),
    todoCtrl.addTodo
);

router.patch(
    "/:id",
    requireAuth,
    validate(validation.modifyTodo, {}, { abortEarly: false }),
    todoCtrl.modifyTodo
);

router.delete("/:id", requireAuth, todoCtrl.deleteTodo);

module.exports = router;
