import { body, ValidationChain } from "express-validator";
import { MonitorType, RequestMethodType } from "@prisma/client";

import { MONITOR_ENDPOINTS_CONSTANTS, MONITOR_VALIDATOR_ENDPOINTS_TYPES } from "../../constant/monitor/monitor.constants";

export const monitorValidator = (method: MONITOR_VALIDATOR_ENDPOINTS_TYPES): ValidationChain[] => {
  let errors: ValidationChain[] = [];

  switch (method) {
    case MONITOR_ENDPOINTS_CONSTANTS.CREATE_MONITOR: {
      errors = [
        body('name')
          .optional()
          .isString().withMessage('name must be a string'),
        body('type')
          .isString().withMessage('type must be a string')
          .isIn(Object.values(MonitorType)).withMessage(`type must be from ${Object.values(MonitorType)}`),
        body('endpoint')
          .isURL().withMessage('endpoint must be a valid url'),
        body('method')
          .optional()
          .isString().withMessage('method must be a string')
          .isIn(Object.values(RequestMethodType)).withMessage(`method must be from ${Object.values(RequestMethodType)}`),
        body('payload')
          .optional()
          .isJSON().withMessage('payload must be in json type'),
        body('headers')
          .optional()
          .isJSON().withMessage('headers must be in json type')
      ];
      break;
    }
  }

  return errors;
}