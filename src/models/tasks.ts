import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export type TaskStatuses =  'new' | 'in progress' | 'completed' | 'archived';
const statuses = ['new', 'in progress', 'completed', 'archived'];

@Entity()
export class Tasks {

  @PrimaryGeneratedColumn()
    id: number;

  @Column()
    'author_id': number;

  @Column()
    'assignee_id': number;

  @Column({
    type: 'enum',
    enum: statuses,
  })
    status: TaskStatuses;

  @Column()
    description: string;
}
