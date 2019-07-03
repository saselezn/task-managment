import { Router } from 'express';
import * as HttpStatus from 'http-status-codes';
import { authHandlers } from '../controllers';
import { UserData } from '../controllers/auth';

const router = Router();

router.post(
    '/',
    async (req, res) => {
      try {
        const data = req.body;
        let userData: UserData;
        try {
          if (!data.email || !data.password) {
            throw new Error('UNAUTHORIZED');
          }
          userData = await authHandlers.checkPassword(data);
        } catch (e) {
          return res.status(HttpStatus.UNAUTHORIZED).send(e.message);
        }

        const token = await authHandlers.createToken(userData);
        return res.status(HttpStatus.OK).send({ token });
      } catch (e) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(e);
      }
    });

export default router;
