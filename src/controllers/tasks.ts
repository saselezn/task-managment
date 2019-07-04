import { getConnection, getRepository } from 'typeorm';
import { get } from 'lodash';
import { Tasks, TaskStatuses } from '../models/tasks';
import { Users } from '../models';
import { emailNotificator } from '../notifications/email';

export interface TaskProps {
  author: number;
  assignee: number;
  description: string;
}

export interface UpdateTaskProps {
  assignee?: number;
  description?: string;
  status?: TaskStatuses;
}

export class TaskHandlers {
  async add(task: TaskProps) {
    return getRepository(Tasks).insert({
      ...task,
      status: 'new',
    });
  }

  async edit(taskId: number, props: UpdateTaskProps) {
    const res = await getConnection()
        .createQueryBuilder()
        .update(Tasks)
        .set(props)
        .where('id = :id', { id: taskId })
        .returning('*')
        .execute();

    const user = await getRepository(Users).findOne({ id: get(res, 'raw[0].assignee_id') });

    if (user) {
      await emailNotificator.sendEmail([user.email], taskId);
    }

    return res;
  }

  async getAll() {
    return getRepository(Tasks).find();
  }

  async getById(id: number) {
    return getRepository(Tasks).findOne({ id });
  }

  async delete(taskId: number) {
    return getRepository(Tasks).delete({ id: taskId });
  }
}

export const taskHandlers = new TaskHandlers();
