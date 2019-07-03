import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1562144100850 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`
        CREATE TYPE roles AS ENUM ('admin', 'user');
        CREATE TYPE statuses AS ENUM ('new', 'in progress', 'completed', 'archived');
        CREATE TABLE users
        (
          id SERIAL PRIMARY KEY,
          email TEXT,
          password VARCHAR,
          role roles
        );

        CREATE TABLE tasks
        (
          id SERIAL PRIMARY KEY,
          author_id INTEGER REFERENCES users(id) ON DELETE RESTRICT,
          assignee_id INTEGER REFERENCES users(id) ON DELETE RESTRICT,
          status statuses,
          description TEXT
        );

        CREATE TABLE comments
        (
          id SERIAL PRIMARY KEY,
          author_id INTEGER REFERENCES users(id) ON DELETE RESTRICT,
          task_id INTEGER REFERENCES tasks(id) ON DELETE RESTRICT,
          text TEXT
        );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`
      DROP TABLE IF EXISTS comments;
      DROP TABLE IF EXISTS tasks;
      DROP TABLE IF EXISTS users;
      DROP TYPE IF EXISTS roles;
      DROP TYPE IF EXISTS statuses;
    `);
  }
}
