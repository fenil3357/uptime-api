import { google } from "googleapis";
import { ENV_VALUES } from "../env/env.config.js";

export const oauth2ClientGoogleAuth = new google.auth.OAuth2(
  ENV_VALUES.GOOGLE_OAUTH_CLIENT_ID,
  ENV_VALUES.GOOGLE_OAUTH_CLIENT_SECRET,
  ENV_VALUES.GOOGLE_AUTH_REDIRECTION_URL
)

export const generateOauth2Client = () => new google.auth.OAuth2(
  ENV_VALUES.GOOGLE_OAUTH_CLIENT_ID,
  ENV_VALUES.GOOGLE_OAUTH_CLIENT_SECRET,
  ENV_VALUES.GOOGLE_AUTH_REDIRECTION_URL
)