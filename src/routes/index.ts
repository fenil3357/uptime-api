import { Router } from "express";

import userRouter from "./user/user.routes.js";
import authRouter from "./auth/auth.routes.js";
import googleAuthRouter from "./google-auth/google-auth.routes.js";
import monitorRouter from "./monitor/monitor.routes.js";

const indexRouter = Router();

indexRouter.use('/auth', authRouter); 
indexRouter.use('/users', userRouter);
indexRouter.use('/auth/google', googleAuthRouter);
indexRouter.use('/monitors', monitorRouter);

export default indexRouter;