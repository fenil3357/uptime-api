import { Router } from "express";

import { userAuthMiddleware } from "../../middleware/auth.middleware.js";
import { createMonitorController } from "../../controllers/monitor/monitor.controller.js";
import { monitorValidator } from "../../validators/monitor/monitor.validator.js";
import { MONITOR_ENDPOINTS_CONSTANTS } from "../../constant/monitor/monitor.constants.js";
import { handleValidationErrors } from "../../validators/handleValidationErrors.js";

const monitorRouter = Router();

monitorRouter.post('/', userAuthMiddleware,
  [
    monitorValidator(MONITOR_ENDPOINTS_CONSTANTS.CREATE_MONITOR) as any,
    handleValidationErrors
  ],
  createMonitorController);

export default monitorRouter;