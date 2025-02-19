import { body, ValidationChain, query, param } from "express-validator";
import { MonitorType, RequestMethodType } from "@prisma/client";

import { MONITOR_ENDPOINTS_CONSTANTS, MONITOR_VALIDATOR_ENDPOINTS_TYPES } from "../../constant/monitor/monitor.constants.js";

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

    case MONITOR_ENDPOINTS_CONSTANTS.GET_ONE_MONITOR: {
      errors = [
        query('id')
          .notEmpty().withMessage('id must be provided')
          .isString().withMessage('id must be a string'),
        query('reportStartDate')
          .optional()
          .matches(/^([\+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-2])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T\s]((([01]\d|2[0-3])((:?)[0-5]\d)?|24\:?00)([\.,]\d+(?!:))?)?(\17[0-5]\d([\.,]\d+)?)?([zZ]|([\+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$/).withMessage('start date must be a valid date'),
        query('reportEndDate')
          .optional()
          .matches(/^([\+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-2])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T\s]((([01]\d|2[0-3])((:?)[0-5]\d)?|24\:?00)([\.,]\d+(?!:))?)?(\17[0-5]\d([\.,]\d+)?)?([zZ]|([\+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$/).withMessage('end date must be a valid date'),
        query('reportOnly')
          .optional()
          .isIn(['1', '0']).withMessage("reportOnly can only have value '1' or '0'"),
        query('monitorOnly')
          .optional()
          .isIn(['1', '0']).withMessage("monitorOnly can only have value '1' or '0'")
      ];
      break;
    }

    case MONITOR_ENDPOINTS_CONSTANTS.UPDATE_MONITOR: {
      errors = [
        body('name')
          .optional()
          .isString().withMessage('name must be a string'),
        body('type')
          .optional()
          .isString().withMessage('type must be a string')
          .isIn(Object.values(MonitorType)).withMessage(`type must be from ${Object.values(MonitorType)}`),
        body('endpoint')
          .optional()
          .isURL().withMessage('endpoint must be a valid url'),
        body('method')
          .optional()
          .isString().withMessage('method must be a string')
          .isIn(Object.values(RequestMethodType)).withMessage(`method must be from ${Object.values(RequestMethodType)}`),
        body('payload')
          .optional({ nullable: true })
          .custom((value) => {
            if (value == null) return true;
            try {
              JSON.parse(JSON.stringify(value));
              return true;
            }
            catch (error) {
              throw new Error('payload must be in valid json type')
            }
          }),
        body('headers')
          .optional({ nullable: true })
          .custom((value) => {
            if (value == null) return true;
            try {
              JSON.parse(JSON.stringify(value));
              return true;
            }
            catch (error) {
              throw new Error('headers must be in valid json type')
            }
          }),
        body('is_active')
          .optional()
          .isBoolean().withMessage('is_active must be a valid boolean value')
      ];
      break;
    }

    case MONITOR_ENDPOINTS_CONSTANTS.DELETE_MONITOR: {
      errors = [
        param('id')
          .notEmpty().withMessage('id must be provided')
          .isString().withMessage('id must be a string')
      ];
      break;
    }
  }

  return errors;
}