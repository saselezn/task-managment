import { getRepository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import * as config from 'config';
import { Users } from '../models';
import * as jwt from 'jsonwebtoken';
import { UserRoles } from '../models/users';

export interface Credentials {
  email: string;
  password: string;
}

export interface UserData {
  id: number;
  role: UserRoles;
}

class AuthHandlers {
  async checkPassword({ email, password }: Credentials): Promise<UserData> {
    const user = await getRepository(Users).findOne({ email });

    if (!user) {
      throw new Error('Wrong password or email');
    }

    if (!bcrypt.compareSync(password, user.password)) {
      throw new Error('Wrong password or email');
    }

    return { id: user.id, role: user.role };
  }

  async createToken(user: UserData) {
    return jwt.sign(user, config.get('app.jwt_secret'), { expiresIn: '1d' });
  }
}

export const authHandlers = new AuthHandlers();
