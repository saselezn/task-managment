import { Request, Response, Router } from 'express';
import * as HttpStatus from 'http-status-codes';
import { commentHandlers } from '../controllers';
import { checkJwtToken } from '../middlewares/checkJwtToken';
import { checkRoles } from '../middlewares/checkRoles';

const router = Router();

router.post('/', [checkJwtToken], async (req: Request, res: Response) => {
  try {
    const result = await commentHandlers.add(req.body);
    return res.status(HttpStatus.OK).send(result.raw);
  } catch (e) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(e);
  }
});

router.get(
    '/',
    [checkJwtToken],
    async (req: Request, res: Response) => {
      const result = await commentHandlers.getAll();
      return res.status(HttpStatus.OK).send(result);
    });

router.delete(
    '/:id',
    [checkJwtToken, checkRoles(['admin'])],
    async (req: Request, res: Response) => {
      const result = await commentHandlers.delete(req.params.id);
      return res.status(HttpStatus.OK).send(result);
    });

export default router;
