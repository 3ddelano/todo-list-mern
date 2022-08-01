const { validate } = require("express-validation");

module.exports.validate = (schema) =>
    validate(schema, { context: true }, { abortEarly: false });
