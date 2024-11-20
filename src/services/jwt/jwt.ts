import jwt from 'jsonwebtoken';
import { ENV_VALUES } from '../../config/env/env.config';

const JWT_SECRET = ENV_VALUES.JWT_SECRET;
const JWT_EXPIRATION = ENV_VALUES.JWT_EXPIRATION;

export function generateToken(payload: any, expiresIn = JWT_EXPIRATION) {
  return jwt.sign(payload, JWT_SECRET as string, { expiresIn: expiresIn });
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET as string);
  } catch (error) {
    throw new Error('Invalid token');
  }
}