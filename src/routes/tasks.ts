import { Router, Request, Response } from 'express';
import * as HttpStatus from 'http-status-codes';
import { taskHandlers } from '../controllers';
import { checkJwtToken } from '../middlewares/checkJwtToken';

const router = Router();

router.post(
    '/',
    [checkJwtToken], async (req: Request, res: Response) => {
      const result = await taskHandlers.add(req.body);
      return res.status(HttpStatus.OK).send(result.raw);
    });

router.patch(
    '/:id',
    [checkJwtToken],
    async (req: Request, res: Response) => {
      const role = res.locals.userData.role;

      if (req.body.status && req.body.status === 'archived' && role !== 'admin') {
        return res.status(HttpStatus.FORBIDDEN).send('FORBIDDEN');
      }

      const result = await taskHandlers.edit(req.params.id, req.body);
      return res.status(HttpStatus.OK).send(result.raw);
    });

router.get(
    '/',
    [checkJwtToken],
    async (req: Request, res: Response) => {
      const result = await taskHandlers.getAll();
      return res.status(HttpStatus.OK).send(result);
    });

router.get(
    '/:id',
    [checkJwtToken],
    async (req: Request, res: Response) => {
      const result = await taskHandlers.getById(req.params.id);

      if (!result) {
        return res.status(HttpStatus.NOT_FOUND).send();
      }

      return res.status(HttpStatus.OK).send(result);
    });

router.delete(
    '/:id',
    [checkJwtToken],
    async (req: Request, res: Response) => {
      const result = await taskHandlers.delete(req.params.id);
      return res.status(HttpStatus.OK).send(result);
    });

export default router;
