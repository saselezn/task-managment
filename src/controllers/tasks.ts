import { getRepository } from 'typeorm';
import { Tasks, TaskStatuses } from '../models/tasks';

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
    return getRepository(Tasks).update({ id: taskId }, props);
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
