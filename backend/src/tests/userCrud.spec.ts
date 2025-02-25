import { Server } from 'http';
import supertest from 'supertest';
import { startServer, stopServer } from './server';
import { UserModel } from '../models';
import GeoLib from '../lib';

describe('User API', () => {
  let server: Server;
  let request: supertest.SuperTest<supertest.Test>;
  let token: string;

  beforeAll(async () => {
    server = await startServer();
    request = supertest(server);

    await request
      .post('/api/signin')
      .send(
        JSON.stringify({
          email: 'bruno@emailteste.com',
          name: 'Bruno',
          password: 'abc12345!',
          address: '14840-000 - Vila Pacifico, Guariba - SP, 14840-000, Brazil',
        })
      )
      .set('Content-Type', 'application/json');

    const response = await request
      .post('/api/login')
      .send(
        JSON.stringify({
          email: 'bruno@emailteste.com',
          password: 'abc12345!',
        })
      )
      .set('Content-Type', 'application/json');

    token = response.body.token;
  });

  afterAll(async () => {
    await stopServer();
  });

  describe('GET /api/user', () => {
    it('should get logged user', async () => {
      const response = await request
        .get('/api/user')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
    });

    it('should error get logged user', async () => {
      const response = await request.get('/api/user');

      expect(response.status).toBe(401);
    });
  });

  describe('PUT /api/user', () => {
    it('should update logged user', async () => {
      const response = await request
        .put('/api/user')
        .send(
          JSON.stringify({
            name: 'bruno',
            email: 'bruno@updated.com',
            address:
              '14840-000 - Vila Pacifico, Guariba - SP, 14840-000, Brazil',
          })
        )
        .set('Authorization', `Bearer ${token}`)
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('message', 'User updated');
    });

    it('should errorupdate logged user', async () => {
      const response = await request
        .put('/api/user')
        .send(
          JSON.stringify({
            name: 'bruno',
            email: 'bruno@updated.com',
            address:
              '14840-000 - Vila Pacifico, Guariba - SP, 14840-000, Brazil',
          })
        )
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(401);
    });
  });

  describe('DELETE /api/user', () => {
    it('should delete logged user', async () => {
      const response = await request
        .delete('/api/user')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
    });

    it('should error delete logged user', async () => {
      const response = await request.delete('/api/user');

      expect(response.status).toBe(401);
    });
  });
});
