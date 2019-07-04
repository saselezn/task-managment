import { getRepository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { omit } from 'lodash';
import { Users } from '../models';
import { UserRoles } from '../models/users';

export interface UserProps {
  email: string;
  password: string;
  role: UserRoles;
}

const genSaltRounds = 10;

class UserHandlers {
  async add({ email, password, role = 'user' }: UserProps) {
    const user = new Users();
    const salt = bcrypt.genSaltSync(genSaltRounds);

    user.email = email;
    user.password = bcrypt.hashSync(password, salt);
    user.role = role;

    return getRepository(Users).save(user);
  }

  async getAll() {
    const users = await getRepository(Users).find({});
    return users.map(user => omit(user, 'password'));
  }
}

export const userHandlers = new UserHandlers();
