const mongoose = require("mongoose");
const connection = mongoose.connection;
const logger = require("./winston");

const connect = async () => {
    try {
        logger.debug("Connecting to MongoDB...");

        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        logger.info(`Connected to MongoDB: ${connection.db.databaseName}`);
    } catch (err) {
        logger.error("Cannot connect to the database!", err);
        process.exit();
    }
};

exports.connect = connect;
exports.connection = connection;
