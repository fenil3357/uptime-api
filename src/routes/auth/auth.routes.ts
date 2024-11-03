import { Router } from "express";
import { createUserController } from "../../controllers/auth/auth.controller";
import { authValidator } from "../../validators/auth/auth.validator";
import { AUTH_ENDPOINTS_CONSTANTS } from "../../constant/auth/auth.constants";
import { handleValidationErrors } from "../../validators/handleValidationErrors";

const authRouter = Router();

authRouter.post('/user',
  [
    authValidator(AUTH_ENDPOINTS_CONSTANTS.CREATE_USER) as any,
    handleValidationErrors
  ],
  createUserController);

export default authRouter;