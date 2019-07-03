import { getRepository } from 'typeorm';
import { Request, Response, NextFunction } from 'express';
import * as HttpStatus from 'http-status-codes';
import { get } from 'lodash';
import { UserRoles, Users } from '../models/users';

export const checkRoles = (roles: UserRoles[]) =>
    async (req: Request, res: Response, next: NextFunction) => {
      const id = get(res, 'locals.userData.id');
      const user = await getRepository(Users).findOne({ id });

      if (!user || !roles.includes(user.role)) {
        return res.status(HttpStatus.FORBIDDEN).send('FORBIDDEN');
      }

      next();
    };
