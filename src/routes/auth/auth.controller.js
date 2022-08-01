const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const util = require("util");

const APIError = require("../../utils/APIError");
const User = require("../../models/user.model");

const getJWT = (userId) => {
    return jwt.sign({ _id: userId }, process.env.JWT_SECRET, {
        algorithm: "HS256",
        expiresIn: "14d",
    });
};

const comparePassword = (password, hashedPassword) => {
    return bcrypt.compareSync(password, hashedPassword);
};

const deleteUser = async (req, res, next) => {
    try {
        const user = User.findById(req.user._id);
        if (!user) return next(new APIError("User not found", 404, true));

        if (user.todos.length > 0) {
            await Promise.all(
                user.todos.map((todoId) =>
                    Device.findByIdAndDelete(todoId).catch((err) => {
                        logger.error(
                            `Unable to delete user's todo with id ${todoId}` +
                                util.inspect(err)
                        );
                    })
                )
            );
        }
        await User.findByIdAndDelete(user._id);
        res.status(200).json({
            success: true,
        });
    } catch (err) {
        if (err.name === "CastError") {
            return next(new APIError("User not found", 404, true));
        } else return next(new APIError(err.message, err.status, false));
    }
};

const login = (req, res, next) => {
    const error = new APIError(
        "Authentication failed. Incorrect credentials.",
        401,
        true
    );

    User.findOne({ email: req.body.email })
        .select("-__v")
        .populate("todos", "-__v")
        .then((user) => {
            if (!user) {
                return next(error);
            }

            if (!comparePassword(req.body.password.toString(), user.password)) {
                return next(error);
            }
            console.log(user);
            const token = getJWT(user._id);

            user.password = undefined;

            return res.status(200).json({
                token,
                user,
            });
        })
        .catch((err) => {
            next(err);
        });
};

const signup = async (req, res, next) => {
    // Check if user with same email exists
    User.findOne({ email: req.body.email })
        .select("_id")
        .then((user) => {
            if (user) {
                return next(new APIError("User already exists", 400, true));
            }
        });

    const hashedPassword = bcrypt.hashSync(req.body.password, 10);
    const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
    });

    user.save()
        .then((savedUser) => {
            // Remove password before sending the saved user object
            savedUser.password = undefined;
            const token = getJWT(user._id);
            res.json({
                token,
                user: { ...savedUser.toObject(), __v: undefined },
            });
        })
        .catch((e) => next(e));
};

// const token = (req, res, next) => {
//     const gotToken = req.body.token;

//     jwt.verify(gotToken, process.env.JWT_SECRET, (err, decoded) => {
//         if (err) {
//             logger.error("JWT ERROR: " + util.inspect(err));
//             return next(new APIError("Invalid Token", 400, true));
//         }

//         if (!decoded._id) return next(new APIError("Invalid Token", 401, true));

//         User.findOne({ _id: decoded._id })
//             .populate("devices", "-values")
//             .then((foundUser) => {
//                 if (!foundUser)
//                     return next(new APIError("Invalid token", 401, true));
//                 foundUser.password = undefined;
//                 return res.status(200).json({
//                     success: true,
//                     user: foundUser,
//                 });
//             });
//     });
// };

module.exports = { login, signup, deleteUser };
