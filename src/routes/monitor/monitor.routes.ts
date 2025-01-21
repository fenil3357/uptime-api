import { Router } from "express";

import { userAuthMiddleware } from "../../middleware/auth.middleware.js";
<<<<<<< Updated upstream
import { createMonitorController } from "../../controllers/monitor/monitor.controller.js";
=======
import { createMonitorController, getOneMonitorController, getUserMonitorsController } from "../../controllers/monitor/monitor.controller.js";
>>>>>>> Stashed changes
import { monitorValidator } from "../../validators/monitor/monitor.validator.js";
import { MONITOR_ENDPOINTS_CONSTANTS } from "../../constant/monitor/monitor.constants.js";
import { handleValidationErrors } from "../../validators/handleValidationErrors.js";

const monitorRouter = Router();

monitorRouter.post('/', userAuthMiddleware,
  [
    monitorValidator(MONITOR_ENDPOINTS_CONSTANTS.CREATE_MONITOR) as any,
    handleValidationErrors
  ],
  createMonitorController
);

<<<<<<< Updated upstream
=======
monitorRouter.get('/', userAuthMiddleware, getUserMonitorsController);

monitorRouter.get('/id/', userAuthMiddleware,
  [
    monitorValidator(MONITOR_ENDPOINTS_CONSTANTS.GET_ONE_MONITOR) as any,
    handleValidationErrors
  ],
  getOneMonitorController
);

>>>>>>> Stashed changes
export default monitorRouter;