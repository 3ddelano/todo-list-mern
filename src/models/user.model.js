const mongoose = require("mongoose");

// Register the Todo model in mongoose
require("./todo.model");

const UserSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        todos: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: "Todo",
            default: [],
        },
    },
    {
        timestamps: true,
    }
);

const User = mongoose.model("User", UserSchema);

module.exports = User;
