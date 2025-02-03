import * as dotenv from 'dotenv'
import path from 'path';

dotenv.config();
const globalEnv = process.env.GLOBAL_ENV;
const envFile = globalEnv === 'production'
  ? '.env'
  : `.env.${globalEnv}.local`;

dotenv.config({
  path: path.resolve(process.cwd(), envFile),
  override: true
})

export const ENV_VALUES = {
  // Port and Endpoints
  PORT: parseInt(process.env.PORT as string),
  CLIENT_ENDPOINT: process.env.CLIENT_ENDPOINT,
  SERVER_ENDPOINT: process.env.SERVER_ENDPOINT,
  SERVER_HEALTH_ENDPOINT: process.env.SERVER_HEALTH_ENDPOINT,

  // Environment
  GLOBAL_ENV: process.env.GLOBAL_ENV,
  NODE_ENV: process.env.NODE_ENV,
  DB_ENV: process.env.DB_ENV,

  // Database
  DATABASE_URL: process.env.DATABASE_URL,

  // Jwt
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRATION: process.env.JWT_EXPIRATION,

  // Encryption
  ENCRYPTION_KEY: process.env.ENCRYPTION_KEY,
  ENCRYPTION_EXPIRATION_TIME: parseInt(process.env.ENCRYPTION_EXPIRATION_TIME as string),

  // Smtp
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: parseInt(process.env.SMTP_PORT as string),
  SMTP_EMAIL: process.env.SMTP_EMAIL,
  SMTP_PASS: process.env.SMTP_PASS,

  // Google OAuth
  GOOGLE_OAUTH_CLIENT_ID: process.env.GOOGLE_OAUTH_CLIENT_ID,
  GOOGLE_OAUTH_CLIENT_SECRET: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
  GOOGLE_AUTH_REDIRECTION_URL: process.env.GOOGLE_AUTH_REDIRECTION_URL,

  // Redis
  REDIS_HOST: process.env.REDIS_HOST,
  REDIS_PORT: parseInt(process.env.REDIS_PORT as string),
  REDIS_USERNAME: process.env.REDIS_USERNAME || undefined,
  REDIS_PASSWORD: process.env.REDIS_PASSWORD || undefined
}