import crypto from 'crypto'
import { ENV_VALUES } from '../../config/env/env.config';

const DEFAULT_ENCRYPTION_KEY = ENV_VALUES.ENCRYPTION_KEY;
const DEFAULT_ENCRYPTION_EXPIRATION_TIME = ENV_VALUES.ENCRYPTION_EXPIRATION_TIME

// Encryption
export const encryption = (data: Record<string, any>, ttl: number = DEFAULT_ENCRYPTION_EXPIRATION_TIME): string => {
  try {
    const timestamp = Date.now() + ttl;
    const payload = JSON.stringify({ ...data, expiresAt: timestamp });
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', DEFAULT_ENCRYPTION_KEY as string, iv);
    let encrypted = cipher.update(payload, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return `${iv.toString('hex')}:${encrypted}`;
  } catch (error: any) {
    console.log("🚀 ~ encryption ~ error:", error)
    throw new Error(error?.message || 'Some error occurred while encrypting the data')
  }
}

// Decryption
export const decryption = (encrypted: string): Record<string, any> => {
  try {
    const [ivHex, encryptedData] = encrypted.split(':');
    const decipher = crypto.createDecipheriv(
      'aes-256-cbc',
      DEFAULT_ENCRYPTION_KEY as string,
      Buffer.from(ivHex, 'hex')
    );
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    const parsedData = JSON.parse(decrypted);

    if (Date.now() > parsedData.expiresAt) {
      throw new Error('Encrypted text has been expired')
    }
    return parsedData;
  } catch (error: any) {
    console.log("🚀 ~ decryption ~ error:", error)
    throw new Error(error?.message || 'Some error occurred while decrypting the data')
  }
}