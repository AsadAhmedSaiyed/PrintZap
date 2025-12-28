const dotenv = require('dotenv');
const Joi = require('joi');

dotenv.config();

const envSchema = Joi.object({
    PORT: Joi.number().default(5000),
    MONGO_URI: Joi.string().required(),
    ZOHO_CLIENT_ID: Joi.string().required(),
    ZOHO_CLIENT_SECRET: Joi.string().required(),
    ZOHO_REFRESH_TOKEN: Joi.string().required()
}).unknown();

const { error, value: envVars } = envSchema.validate(process.env);

if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}

const config = {
    env: process.env.NODE_ENV || 'development',
    port: envVars.PORT,
    mongo: {
        uri: envVars.MONGO_URI,
    },
    zoho: {
        clientId: envVars.ZOHO_CLIENT_ID,
        clientSecret: envVars.ZOHO_CLIENT_SECRET,
        refreshToken: envVars.ZOHO_REFRESH_TOKEN
    }
};

module.exports = config;
