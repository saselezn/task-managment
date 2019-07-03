import { getRepository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Users } from '../models';

export interface UserProps {
  email: string;
  password: string;
}

const genSaltRounds = 10;

class UserHandlers {
  async add({ email, password }: UserProps) {
    const user = new Users();
    const salt = bcrypt.genSaltSync(genSaltRounds);

    user.email = email;
    user.password = bcrypt.hashSync(password, salt);

    return getRepository(Users).save(user);
  }

  async getAll() {
    return getRepository(Users).find({});
  }
}

export const userHandlers = new UserHandlers();
