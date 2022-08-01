const util = require("util");
const bcrypt = require("bcrypt");

const logger = require("../../config/winston");
const User = require("../../models/user.model");
const APIError = require("../../utils/APIError");

const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id)
            .select("-password -__v")
            .populate("todos", "-__v");
        if (!user) return next(new APIError("User not found", 404, true));

        res.status(200).json({
            user,
        });
    } catch (err) {
        logger.error("Failed to get user: " + util.inspect(err));
        return next(new APIError("Failed to get user", 500, true));
    }
};

const modifyUser = async (req, res, next) => {
    try {
        const { password: actualHashedPassword } = await User.findById(
            req.user._id
        ).select("password");

        const { username, password, currentPassword } = req.body;

        if (!bcrypt.compareSync(currentPassword, actualHashedPassword))
            return next(new APIError("Incorrect current password.", 422, true));

        const user = await User.findByIdAndUpdate(
            req.user._id,
            {
                username: username,
                password: password ? bcrypt.hashSync(password, 10) : undefined,
            },
            {
                new: true,
            }
        ).select("-password -__v -todos");

        return res.json({
            user,
        });
    } catch (err) {
        logger.error("Failed to modify password: " + util.inspect(err));
        return next(new APIError("Failed to modify password", 500, true));
    }
};

// const modifyUser = async (req, res, next) => {
//     try {
//         const updateResult = await User.updateOne(
//             { _id: req.user._id },
//             {
//                 username: req.body.username,
//             }
//         );
//         if (updateResult.modifiedCount != 1)
//             return next(new APIError("Failed to modify username", 500, true));

//         return res.status(204).end();
//     } catch (err) {
//         logger.error("Failed to modify username: " + util.inspect(err));
//         return next(new APIError("Failed to modify username", 500, true));
//     }
// };

module.exports = { getUser, modifyUser };
