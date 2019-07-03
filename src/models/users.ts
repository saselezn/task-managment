import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export type UserRoles =  'admin' | 'user';
const roles = ['admin', 'user'];

@Entity()
export class Users {

  @PrimaryGeneratedColumn()
    id: number;

  @Column()
    email: string;

  @Column()
    password: string;

  @Column({
    type: 'enum',
    enum: roles,
  })
    role: UserRoles;
}
