import { Router } from "express";
import { googleAuthCallbackController, googleAuthController, googleAuthEncryptionController } from "../../controllers/google-auth/google-auth.controller";

const googleAuthRouter = Router()

googleAuthRouter.get('/', googleAuthController);
googleAuthRouter.get('/callback', googleAuthCallbackController);
googleAuthRouter.get('/encryption', googleAuthEncryptionController);

export default googleAuthRouter;