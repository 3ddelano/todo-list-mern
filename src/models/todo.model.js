const mongoose = require("mongoose");

const TodoSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            minlength: 1,
            maxlength: 2048,
        },
        done: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

const Todo = mongoose.model("Todo", TodoSchema);
module.exports = Todo;
