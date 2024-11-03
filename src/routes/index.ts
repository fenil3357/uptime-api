import { Router } from "express";

import userRouter from "./user/user.routes";
import { BadRequestError } from "../helper/errors/custom-errors";
import authRouter from "./auth/auth.routes";

const indexRouter = Router();

indexRouter.use('/auth', authRouter); 
indexRouter.use('/users', userRouter);

export default indexRouter;