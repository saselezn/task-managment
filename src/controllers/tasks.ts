import { Connection, Repository } from 'typeorm';
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
  private repo: Repository<Tasks>;

  constructor(connection: Connection) {
    this.repo = connection.getRepository(Tasks);
  }

  async add(task: TaskProps) {
    return this.repo.insert({
      ...task,
      status: 'new',
    });
  }

  async edit(taskId: number, props: UpdateTaskProps) {
    return this.repo.update({ id: taskId }, props);
  }

  async getAll() {
    return this.repo.find();
  }

  async getById(id: number) {
    return this.repo.findOne({ id });
  }

  async delete(taskId: number) {
    return this.repo.delete({ id: taskId });
  }
}
