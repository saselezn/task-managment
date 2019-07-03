import { Request, Response, NextFunction } from 'express';
import * as HttpStatus from 'http-status-codes';
import * as jwt from 'jsonwebtoken';
import * as config from 'config';
import { get } from 'lodash';
import { UserData } from '../controllers/auth';

export const checkJwtToken = (req: Request, res: Response, next: NextFunction) => {
  const token = get(req, 'cookies.token');
  let userData: UserData;

  if (!token) {
    return res.status(HttpStatus.UNAUTHORIZED).send('UNAUTHORIZED');
  }

  try {
    userData = <UserData>jwt.verify(token, config.get('app.jwt_secret'));
    res.locals.userData = userData;
  } catch (e) {
    return res.status(HttpStatus.UNAUTHORIZED).send('UNAUTHORIZED');
  }

  next();
};
