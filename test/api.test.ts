import { expect } from 'chai';
import * as HttpStatus from 'http-status-codes';
import * as supertest from 'supertest';
import { initApp } from '../src/server';
import { db } from '../src/db';
import { Connection } from 'typeorm';
import { Tasks, Users, Comments } from '../src/models';

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

      expect(res.body[0]).has.property('id');
      expect(res.body[0].id).to.be.a('number');

      userId = res.body[0].id;
    });

    it('should return user from db', async () => {
      const res = await req.get('/users').expect(HttpStatus.OK);

      expect(res.body[0]).has.property('id');
      expect(res.body[0].id).to.equal(userId);
    });
  });

  describe('Task test', () => {
    let userId: number;
    let taskId: number;

    before('Create user', async () => {
      const data = {
        email: 'test@gmail.com',
        password: 'pwd',
      };

      const res = await req.post('/users').send(data).expect(HttpStatus.OK);
      userId = res.body[0].id;
    });

    after('remove user and task', async () => {
      await conn.getRepository(Users).delete(userId);
      await conn.getRepository(Tasks).delete(taskId);
    });

    it('should create task', async () => {
      const data = {
        author_id: userId,
        assignee_id: userId,
        description: 'test',
      };

      const res = await req.post('/tasks').send(data).expect(HttpStatus.OK);

      expect(res.body[0]).has.property('id');
      expect(res.body[0].id).to.be.a('number');

      taskId = res.body[0].id;
    });

    it('should return task from db', async () => {
      const res = await req.get('/tasks').expect(HttpStatus.OK);

      expect(res.body[0]).has.property('id');
      expect(res.body[0].id).to.equal(taskId);
    });

    it('should return task by id from db', async () => {
      const res = await req.get(`/tasks/${taskId}`).expect(HttpStatus.OK);

      expect(res.body).has.property('id');
      expect(res.body.id).to.equal(taskId);
    });

    it('should remove task from db', async () => {
      await req.delete(`/tasks/${taskId}`).expect(HttpStatus.OK);
      await req.get(`/tasks/${taskId}`).expect(HttpStatus.NOT_FOUND);
    });
  });

  describe('Comment test', () => {
    let userId: number;
    let taskId: number;
    let commentId: number;

    before('Create user', async () => {
      const user = {
        email: 'test@gmail.com',
        password: 'pwd',
      };

      const resUser = await req.post('/users').send(user).expect(HttpStatus.OK);
      userId = resUser.body[0].id;

      const task = {
        author_id: userId,
        assignee_id: userId,
        description: 'test',
      };

      const resTask = await req.post('/tasks').send(task).expect(HttpStatus.OK);

      taskId = resTask.body[0].id;
    });

    after('remove user and task', async () => {
      await conn.getRepository(Comments).delete(commentId);
      await conn.getRepository(Tasks).delete(taskId);
      await conn.getRepository(Users).delete(userId);
    });

    it('should create comment', async () => {
      const data = {
        author_id: userId,
        task_id: taskId,
        text: 'test',
      };

      const res = await req.post('/comments').send(data).expect(HttpStatus.OK);

      expect(res.body[0]).has.property('id');
      expect(res.body[0].id).to.be.a('number');

      commentId = res.body[0].id;
    });

    it('should return comment from db', async () => {
      const res = await req.get('/comments').expect(HttpStatus.OK);

      expect(res.body[0]).has.property('id');
      expect(res.body[0].id).to.equal(commentId);
    });

    it('should remove comment from db', async () => {
      await req.delete(`/comments/${commentId}`).expect(HttpStatus.OK);
      const res = await req.get('/comments').expect(HttpStatus.OK);

      expect(res.body.length).to.equal(0);
    });
  });
});
