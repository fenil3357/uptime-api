import express, { NextFunction, Request, Response } from 'express'
import { PrismaClient } from '@prisma/client';
import helmet from 'helmet';
import cors from 'cors'
import morgan from 'morgan'

import indexRouter from './routes';
import { CustomError, handleError, NotFoundError } from './helper/errors/custom-errors';
import { ENV_VALUES } from './config/env/env.config';

const app = express();
const prisma = new PrismaClient();
const PORT = ENV_VALUES.PORT || 8002;

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(morgan("combined"))
app.use(express.urlencoded({
  limit: '50mb',
  extended: true
}))

app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to the uptime server!!!');
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
    console.log(`Server is listening on port ${PORT} in ${ENV_VALUES.GLOBAL_ENV} environment!!!`);
  } catch (error) {
    console.log(`Some error occurred while starting the server`, error);
  }
})