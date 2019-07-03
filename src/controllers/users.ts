import { Connection, Repository } from 'typeorm';
import { Users } from '../models';

export interface UserProps {
  email: string;
  password: string;
}

export class UserHandlers {
  private repo: Repository<Users>;

  constructor(connection: Connection) {
    this.repo = connection.getRepository(Users);
  }

  async add(user: UserProps) {
    return this.repo.insert({
      ...user,
      role: 'user',
    });
  }

  async getAll() {
    return this.repo.find({});
  }
}
