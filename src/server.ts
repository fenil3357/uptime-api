import express, { NextFunction, Request, Response } from 'express'
import helmet from 'helmet';
import cors from 'cors'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit';

import indexRouter from './routes/index.js';
import { CustomError, handleError, NotFoundError, TooManyRequestsError } from './helper/errors/custom-errors.js';
import { ENV_VALUES } from './config/env/env.config.js';
import { scheduleCronJob } from './services/cron/cron.service.js';
import { CRON_JOBS } from './constant/cron/cron.constants.js';
import { prisma } from './config/Prisma/prisma.client.js'

// Import job workers
import './services/bull/workers/bull-workers.service.js'
import connectRabbitMq from './config/rabbitmq/rabbitmq.config.js';
import { IRequestWithUser } from './types/utils.interface.js';

const app = express();
const PORT = ENV_VALUES.PORT || 8002;

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(morgan((ENV_VALUES.GLOBAL_ENV === 'development') ? "dev" : "combined"))
app.use(express.urlencoded({
  limit: '50mb',
  extended: true
}))
app.use(rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 50,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  keyGenerator: (req: IRequestWithUser) => {
    if (req?.user) return req?.user?.id?.toString();
    return req?.ip as string;
  },
  handler: (_req: Request, res: Response) => {
    return handleError(new TooManyRequestsError('Too many requests, please try again later.'), res);
  }
}));

app.get('/', (_req: Request, res: Response) => {
  res.send('Welcome to the uptime server!!!');
})

app.get('/api/v1/ping', (_req: Request, res: Response) => {
  res.json({ status: 'Healthy' })
})

app.use('/api/v1', indexRouter);

app.all('*', (req: Request, res: Response, next: NextFunction) => {
  next(new NotFoundError("This route does not exists on server."));
})

app.use((err: CustomError, req: Request, res: Response, next: NextFunction) => {
  return handleError(err, res);
})

app.listen(PORT, async () => {
  try {
    await prisma.$connect();
    await scheduleCronJob(CRON_JOBS.REGULAR_MONITOR_CHECK);
    await scheduleCronJob(CRON_JOBS.REGULAR_SERVER_HEALTH_CHECK);
    await scheduleCronJob(CRON_JOBS.RECENT_ERROR_REPORTS_MONITOR_REMOVAL);
    await connectRabbitMq();
    console.log(`Server is listening on port ${PORT} in ${ENV_VALUES.GLOBAL_ENV} environment!!!`);
  } catch (error) {
    console.log(`Some error occurred while starting the server`, error);
  }
})