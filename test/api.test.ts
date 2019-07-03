import { expect } from 'chai';
import * as HttpStatus from 'http-status-codes';
import * as supertest from 'supertest';
import * as jwt from 'jsonwebtoken';
import * as config from 'config';
import { Connection } from 'typeorm';
import { initApp } from '../src/server';
import { db } from '../src/db';
import { Tasks, Users, Comments } from '../src/models';
import { UserData } from '../src/controllers/auth';
import { UserRoles } from '../src/models/users';

interface UserFields {
  email: string;
  password?: string;
  role: UserRoles;
}

const createTestToken = (userData: UserData) =>
    jwt.sign(userData, config.get('app.jwt_secret'), { expiresIn: '1d' });

const createUser = async (
    conn: Connection,
    { email, role = 'user', password = '123' }: UserFields,
): Promise<number> => {
  const resp = await conn.getRepository(Users).insert({
    email,
    password,
    role,
  });
  return resp.raw[0].id;
};

describe('API test', () => {
  let req: any;
  let conn: Connection;

  before('init app', async() => {
    conn = await db.connect();
    const app = await initApp();
    req = supertest(app);
  });

  describe('Users test', () => {
    let userId: number;

    after('remove users', async () => {
      await conn.getRepository(Users).delete(userId);
    });

    it('should create user', async () => {
      const data = {
        email: 'test@gmail.com',
        password: 'pwd',
      };

      const res = await req.post('/users').send(data).expect(HttpStatus.OK);

      expect(res.body).has.property('id');
      expect(res.body.id).to.be.a('number');

      userId = res.body.id;
    });

    it('should return user from db', async () => {
      const res = await req
          .get('/users')
          .set('Cookie', `token=${createTestToken({ id: userId, role: 'user' })}`);

      const createdUser = res.body.find((user: { id: number }) => user.id === userId);

      expect(res.statusCode).to.equal(HttpStatus.OK);
      expect(res.body.length).not.equal(0);
      expect(createdUser).not.equal(undefined);
    });
  });

  describe('Task test', () => {
    let userId: number;
    let taskId: number;
    let adminId: number;

    before('Create user', async () => {
      userId = await createUser(conn, { role: 'user', email: 'user@email.com' });
      adminId = await createUser(conn, { role: 'admin', email: 'admin@email.com' });
    });

    after('remove user and task', async () => {
      await conn.getRepository(Tasks).delete(taskId);
      await conn.getRepository(Users).delete([userId, adminId]);
    });

    it('should create task', async () => {
      const data = {
        author_id: userId,
        assignee_id: userId,
        description: 'test',
      };

      const res = await req
          .post('/tasks')
          .set('Cookie', `token=${createTestToken({ id: userId, role: 'user' })}`)
          .send(data).expect(HttpStatus.OK);

      expect(res.body[0]).has.property('id');
      expect(res.body[0].id).to.be.a('number');

      taskId = res.body[0].id;
    });

    it('should throw error when user tries to archive task', async () => {
      const data = {
        status: 'archived',
      };

      await req
          .patch(`/tasks/${taskId}`)
          .set('Cookie', `token=${createTestToken({ id: userId, role: 'user' })}`)
          .send(data).expect(HttpStatus.FORBIDDEN);
    });

    it('should successfully archive task', async () => {
      const data = {
        status: 'archived',
      };

      await req
          .patch(`/tasks/${taskId}`)
          .set('Cookie', `token=${createTestToken({ id: adminId, role: 'admin' })}`)
          .send(data).expect(HttpStatus.OK);

      const res = await req
          .get(`/tasks/${taskId}`)
          .set('Cookie', `token=${createTestToken({ id: userId, role: 'user' })}`)
          .expect(HttpStatus.OK);

      expect(res.body.id).to.equal(taskId);
      expect(res.body.status).to.equal(data.status);
    });

    it('should return task from db', async () => {
      const res = await req
          .get('/tasks')
          .set('Cookie', `token=${createTestToken({ id: userId, role: 'user' })}`)
          .expect(HttpStatus.OK);

      expect(res.body[0]).has.property('id');
      expect(res.body[0].id).to.equal(taskId);
    });

    it('should return task by id from db', async () => {
      const res = await req
          .get(`/tasks/${taskId}`)
          .set('Cookie', `token=${createTestToken({ id: userId, role: 'user' })}`)
          .expect(HttpStatus.OK);

      expect(res.body).has.property('id');
      expect(res.body.id).to.equal(taskId);
    });

    it('should remove task from db', async () => {
      await req
          .delete(`/tasks/${taskId}`)
          .set('Cookie', `token=${createTestToken({ id: userId, role: 'user' })}`)
          .expect(HttpStatus.OK);
      await req
          .get(`/tasks/${taskId}`)
          .set('Cookie', `token=${createTestToken({ id: userId, role: 'user' })}`)
          .expect(HttpStatus.NOT_FOUND);
    });
  });

  describe('Comment test', () => {
    let userId: number;
    let taskId: number;
    let commentId: number;
    let adminId: number;

    before('Create user', async () => {
      userId = await createUser(conn, { role: 'user', email: 'user@email.com' });
      adminId = await createUser(conn, { role: 'admin', email: 'admin@email.com' });

      const task = {
        author_id: userId,
        assignee_id: userId,
        description: 'test',
      };

      const resTask = await req
          .post('/tasks')
          .set('Cookie', `token=${createTestToken({ id: userId, role: 'user' })}`)
          .send(task)
          .expect(HttpStatus.OK);

      taskId = resTask.body[0].id;
    });

    after('remove user and task', async () => {
      await conn.getRepository(Comments).delete(commentId);
      await conn.getRepository(Tasks).delete(taskId);
      await conn.getRepository(Users).delete([userId, adminId]);
    });

    it('should create comment', async () => {
      const data = {
        author_id: userId,
        task_id: taskId,
        text: 'test',
      };

      const res = await req
          .post('/comments')
          .set('Cookie', `token=${createTestToken({ id: userId, role: 'user' })}`)
          .send(data)
          .expect(HttpStatus.OK);

      expect(res.body[0]).has.property('id');
      expect(res.body[0].id).to.be.a('number');

      commentId = res.body[0].id;
    });

    it('should return comment from db', async () => {
      const res = await req
          .get('/comments')
          .set('Cookie', `token=${createTestToken({ id: userId, role: 'user' })}`)
          .expect(HttpStatus.OK);

      expect(res.body[0]).has.property('id');
      expect(res.body[0].id).to.equal(commentId);
    });

    it('should remove comment from db', async () => {
      await req
          .delete(`/comments/${commentId}`)
          .set('Cookie', `token=${createTestToken({ id: adminId, role: 'admin' })}`)
          .expect(HttpStatus.OK);
      const res = await req
          .get('/comments')
          .set('Cookie', `token=${createTestToken({ id: userId, role: 'user' })}`)
          .expect(HttpStatus.OK);

      expect(res.body.length).to.equal(0);
    });
    it('should return 403 error when user tries to remove comment from db', async () => {
      await req
          .delete(`/comments/${commentId}`)
          .set('Cookie', `token=${createTestToken({ id: userId, role: 'user' })}`)
          .expect(HttpStatus.FORBIDDEN);
    });
  });
});
