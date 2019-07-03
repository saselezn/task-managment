import { Request, Response, Router } from 'express';
import * as HttpStatus from 'http-status-codes';
import { userHandlers } from '../controllers';
import { checkJwtToken } from '../middlewares/checkJwtToken';

const router = Router();

router.post(
    '/',
    async (req: Request, res: Response) => {
      try {
        const result = await userHandlers.add(req.body);
        return res.status(HttpStatus.OK).send({ id: result.id });
      } catch (e) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(e);
      }
    });

router.get(
    '/',
    [checkJwtToken],
    async (req: Request, res: Response) => {
      const result = await userHandlers.getAll();
      return res.status(HttpStatus.OK).send(result);
    });

export default router;
