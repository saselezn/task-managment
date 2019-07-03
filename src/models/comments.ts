import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Comments {

  @PrimaryGeneratedColumn()
    id: number;

  @Column()
    'author_id': number;

  @Column()
    'task_id': number;

  @Column()
    text: string;
}
