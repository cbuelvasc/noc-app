import 'dotenv/config';
import * as env from 'env-var/env-var';

export const envs = {
    API_PORT: env.get('API_PORT').required().asPortNumber(),
    MAILER_EMAIL: env.get('MAILER_EMAIL').required().asEmailString(),
    MAILER_SECRET_KEY: env.get('MAILER_SECRET_KEY').required().asString(),
    MAILER_SERVICE: env.get('MAILER_SERVICE').required().asString(),
    NODE_ENV: env.get('NODE_ENV').required().asString(),
};