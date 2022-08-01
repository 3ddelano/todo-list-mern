const logger = require("../../config/winston");
const APIError = require("../../utils/APIError");
const util = require("util");
const User = require("../../models/user.model");
const Todo = require("../../models/todo.model");

const getTodos = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id)
            .select("todos")
            .populate("todos", "-__v");

        res.status(200).json({
            todos: user.todos,
        });
    } catch (err) {
        logger.error("Failed to add todo: " + util.inspect(err));
        return next(new APIError("Failed to add todo.", 500, true));
    }
};

const addTodo = async (req, res, next) => {
    try {
        let todo = Todo(req.body);
        [todo, updateResult] = await Promise.all([
            todo.save(),
            User.updateOne(
                { _id: req.user._id },
                {
                    $push: {
                        todos: todo,
                    },
                }
            ),
        ]);
        todo = await Todo.findById(todo._id).select("-__v");
        res.status(200).json({
            todo,
        });
    } catch (err) {
        logger.error("Failed to add todo: " + util.inspect(err));
        return next(new APIError("Failed to add todo.", 500, true));
    }
};

const deleteTodo = async (req, res, next) => {
    try {
        const id = req.params.id;
        console.log("id: " + id);
        const updateResult = await User.updateOne(
            {
                _id: req.user._id,
                todos: id,
            },
            {
                $pull: {
                    todos: id,
                },
            }
        );
        await Todo.findByIdAndDelete(id);

        if (updateResult.matchedCount === 0)
            return next(new APIError("Todo not found", 404, true));

        res.status(204).end();
    } catch (err) {
        logger.error("Failed to add todo: " + util.inspect(err));
        return next(new APIError("Failed to add todo.", 500, true));
    }
};

const modifyTodo = async (req, res, next) => {
    try {
        const id = req.params.id;
        const updateResult = await Todo.findByIdAndUpdate(
            {
                _id: id,
            },
            {
                $set: {
                    name: req.body.name,
                    done: req.body.done,
                },
            },
            { new: true }
        ).select("-__v");
        console.log(updateResult);

        res.json({
            todo: updateResult,
        });
    } catch (err) {
        if (err.name == "CastError") {
            return next(new APIError("Todo not found", 404, true));
        }
        logger.error("Failed to add todo: " + util.inspect(err));
        return next(new APIError("Failed to add todo.", 500, true));
    }
};

module.exports = { getTodos, addTodo, deleteTodo, modifyTodo };
