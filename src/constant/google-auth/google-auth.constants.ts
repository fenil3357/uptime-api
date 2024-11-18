export const GOOGLE_AUTH_ENDPOINTS_CONSTANTS = {
  GOOGLE_AUTH: 'GOOGLE_AUTH'
}

export type GOOGLE_AUTH_VALIDATOR_ENDPOINTS_TYPES = typeof GOOGLE_AUTH_ENDPOINTS_CONSTANTS[keyof typeof GOOGLE_AUTH_ENDPOINTS_CONSTANTS];

export const GOOGLE_OAUTH_LOGIN_SCOPES: string[] = [
  'https://www.googleapis.com/auth/userinfo.profile',
  'https://www.googleapis.com/auth/userinfo.email'
];