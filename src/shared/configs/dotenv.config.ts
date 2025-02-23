import * as Joi from 'joi';
import { Environment } from 'src/shared/enums/environment.enum';

export const dotenvConfig = Joi.object({
    PORT: Joi.number().port().default(3000),
    NODE_ENV: Joi.string()
        .valid(...Object.values(Environment))
        .default(Environment.Development),
    IS_DEVELOPMENT: Joi.boolean().when('NODE_ENV', {
        is: Joi.equal(Environment.Development),
        then: Joi.boolean().default(true),
        otherwise: Joi.boolean().default(false),
    }),
    CORS_ALLOW_ORIGIN: Joi.string().required(),
    CONNECTION_STRING: Joi.string().optional(),
});
