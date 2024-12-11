import { body, ValidationChain } from 'express-validator'
import { AUTH_VALIDATOR_ENDPOINTS_TYPES, AUTH_ENDPOINTS_CONSTANTS } from '../../constant/auth/auth.constants.js';

export const authValidator = (method: AUTH_VALIDATOR_ENDPOINTS_TYPES): ValidationChain[] => {
  let errors: ValidationChain[] = [];
  switch (method) {
    case AUTH_ENDPOINTS_CONSTANTS.CREATE_USER: {
      errors = [
        body('email')
          .isEmail().withMessage('email field must be a valid email'),
        body('password')
          .isStrongPassword().withMessage('password must be a strong password'),
        body('name')
          .isString().withMessage('name must be provided')
          .not().isEmpty().withMessage('name must not be empty')
      ]
      break;
    }
    default:
      break;
  }
  return errors;
};