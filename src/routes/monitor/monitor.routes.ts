import { Router } from "express";

import { userAuthMiddleware } from "../../middleware/auth.middleware";
import { createMonitorController } from "../../controllers/monitor/monitor.controller";
import { monitorValidator } from "../../validators/monitor/monitor.validator";
import { MONITOR_ENDPOINTS_CONSTANTS } from "../../constant/monitor/monitor.constants";
import { handleValidationErrors } from "../../validators/handleValidationErrors";

const monitorRouter = Router();

monitorRouter.post('/', userAuthMiddleware,
  [
    monitorValidator(MONITOR_ENDPOINTS_CONSTANTS.CREATE_MONITOR) as any,
    handleValidationErrors
  ],
  createMonitorController);

export default monitorRouter;