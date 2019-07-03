import { getRepository } from 'typeorm';
import { Comments } from '../models';

export interface CommentProps {
  author_id: number;
  task_id: number;
  text: string;
}

class CommentHandlers {
  async add(comment: CommentProps) {
    return getRepository(Comments).insert(comment);
  }

  async getAll() {
    return getRepository(Comments).find({});
  }

  async delete(id: number) {
    return getRepository(Comments).delete({ id });
  }
}

export const commentHandlers = new CommentHandlers();
