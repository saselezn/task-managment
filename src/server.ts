import * as express from 'express';
import * as HttpStatus from 'http-status-codes';
import * as bodyParser from 'body-parser';
import { db } from './db';
import { TaskHandlers, UserHandlers, CommentHandlers } from './controllers';

const app = express();

app.use(bodyParser.json());

export const initApp = async () => {
  const connection = await db.connect();
  const taskHandler = new TaskHandlers(connection);
  const userHandler = new UserHandlers(connection);
  const commentHandler = new CommentHandlers(connection);

  app.post('/users', async (req, res) => {
    try {
      const result = await userHandler.add(req.body);
      return res.status(HttpStatus.OK).send(result.raw);
    } catch (e) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(e);
    }
  });

  app.get('/users', async (req, res) => {
    const result = await userHandler.getAll();
    return res.status(HttpStatus.OK).send(result);
  });

  app.post('/tasks', async (req, res) => {
    const result = await taskHandler.add(req.body);
    return res.status(HttpStatus.OK).send(result.raw);
  });

  app.patch('/tasks/:id', async (req, res) => {
    const result = await taskHandler.edit(req.params.id, req.body);
    return res.status(HttpStatus.OK).send(result.raw);
  });

  app.get('/tasks', async (req, res) => {
    const result = await taskHandler.getAll();
    return res.status(HttpStatus.OK).send(result);
  });

  app.get('/tasks/:id', async (req, res) => {
    const result = await taskHandler.getById(req.params.id);

    if (!result) {
      return res.status(HttpStatus.NOT_FOUND).send();
    }

    return res.status(HttpStatus.OK).send(result);
  });

  app.delete('/tasks/:id', async (req, res) => {
    const result = await taskHandler.delete(req.params.id);
    return res.status(HttpStatus.OK).send(result);
  });

  app.post('/comments', async (req, res) => {
    try {
      const result = await commentHandler.add(req.body);
      return res.status(HttpStatus.OK).send(result.raw);
    } catch (e) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(e);
    }
  });

  app.get('/comments', async (req, res) => {
    const result = await commentHandler.getAll();
    return res.status(HttpStatus.OK).send(result);
  });

  app.delete('/comments/:id', async (req, res) => {
    const result = await commentHandler.delete(req.params.id);
    return res.status(HttpStatus.OK).send(result);
  });

  return app;
};
