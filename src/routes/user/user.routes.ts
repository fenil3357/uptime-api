import { Router } from "express";
import { userAuthMiddleware } from "../../middleware/auth.middleware.js";
import { getOneUserController } from "../../controllers/user/user.controller.js";

const userRouter = Router();

userRouter.get('/', userAuthMiddleware, getOneUserController);

export default userRouter;