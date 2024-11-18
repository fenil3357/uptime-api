import { Router } from "express";

import userRouter from "./user/user.routes";
import authRouter from "./auth/auth.routes";
import googleAuthRouter from "./google-auth/google-auth.routes";

const indexRouter = Router();

indexRouter.use('/auth', authRouter); 
indexRouter.use('/users', userRouter);
indexRouter.use('/auth/google', googleAuthRouter);

export default indexRouter;