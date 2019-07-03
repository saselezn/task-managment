import { Connection, Repository } from 'typeorm';
import { Comments } from '../models';

export interface CommentProps {
  author_id: number;
  task_id: number;
  text: string;
}

export class CommentHandlers {
  private repo: Repository<Comments>;

  constructor(connection: Connection) {
    this.repo = connection.getRepository(Comments);
  }

  async add(comment: CommentProps) {
    return this.repo.insert(comment);
  }

  async getAll() {
    return this.repo.find({});
  }

  async delete(id: number) {
    return this.repo.delete({ id });
  }
}
