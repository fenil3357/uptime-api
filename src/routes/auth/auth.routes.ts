import { Router } from "express";

import { createUserController } from "../../controllers/auth/auth.controller.js";
import { authValidator } from "../../validators/auth/auth.validator.js";
import { AUTH_ENDPOINTS_CONSTANTS } from "../../constant/auth/auth.constants.js";
import { handleValidationErrors } from "../../validators/handleValidationErrors.js";

const authRouter = Router();

authRouter.post('/user',
  [
    authValidator(AUTH_ENDPOINTS_CONSTANTS.CREATE_USER) as any,
    handleValidationErrors
  ],
  createUserController);

export default authRouter;