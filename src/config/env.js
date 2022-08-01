const Joi = require("joi");

require("dotenv").config();

const envVarsSchema = Joi.object({
    NODE_ENV: Joi.string()
        .allow("development", "production")
        .default("development"),
    PORT: Joi.number().default(5000),
    JWT_SECRET: Joi.string()
        .required()
        .description("JWT Secret required to sign"),
    MONGODB_URI: Joi.string().default(
        "mongodb://localhost:27017/todo-list-mern"
    ),
})
    .unknown()
    .required();

const { value, error } = envVarsSchema.validate(process.env);
process.env = value;

if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}
