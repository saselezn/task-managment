import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as helmet from 'helmet';
import * as cors from 'cors';
import * as cookieParser from 'cookie-parser';
import { db } from './db';
import { userRouter, taskRouter, commentRouter, loginRouter } from './routes';

export const initApp = async () => {
  await db.connect();

  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(bodyParser.json());
  app.use(cookieParser());

  app.use('/users', userRouter);
  app.use('/tasks', taskRouter);
  app.use('/comments', commentRouter);
  app.use('/login', loginRouter);

  return app;
};
