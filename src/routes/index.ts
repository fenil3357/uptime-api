import { Router } from "express";

import userRouter from "./user/user.routes";
import authRouter from "./auth/auth.routes";
import googleAuthRouter from "./google-auth/google-auth.routes";
import monitorRouter from "./monitor/monitor.routes";

const indexRouter = Router();

indexRouter.use('/auth', authRouter); 
indexRouter.use('/users', userRouter);
indexRouter.use('/auth/google', googleAuthRouter);
indexRouter.use('/monitors', monitorRouter);

export default indexRouter;