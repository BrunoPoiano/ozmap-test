import { Server } from 'http';
import supertest from 'supertest';
import { startServer, stopServer } from './server';
import { Region } from '../models';
import GeoLib from '../lib';
const mongoose = require('mongoose');

describe('Region API', () => {
  let server: Server;
  let request: supertest.SuperTest<supertest.Test>;
  let token: string;
  let region: Region;

  beforeAll(async () => {
    server = await startServer();
    request = supertest(server);

    await request
      .post('/api/signin')
      .send(
        JSON.stringify({
          email: 'bruno@teste.com',
          name: 'Bruno',
          address: 'Guariba - SP Brazil',
          password: 'abc12345!',
        })
      )
      .set('Content-Type', 'application/json');

    //Login User
    const response = await request
      .post('/api/login')
      .send(
        JSON.stringify({
          email: 'bruno@teste.com',
          password: 'abc12345!',
        })
      )
      .set('Content-Type', 'application/json');

    token = response.body.token;
  });

  afterAll(async () => {
    await stopServer();
  });

  describe('POST /api/region', () => {
    it('should create a region', async () => {
      const response = await request
        .post('/api/region')
        .send(
          JSON.stringify({
            name: 'Polygon',
            coordinates: [
              [
                [-46.62529, -23.533773],
                [-46.62429, -23.534773],
                [-46.62329, -23.532773],
                [-46.62529, -23.533773],
              ],
            ],
          })
        )
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('region');
      region = response.body.region;
    });

    it('should create a region', async () => {
      const response = await request
        .post('/api/region')
        .send(
          JSON.stringify({
            name: 'Polygon',
            coordinates: [
              [
                [-46.62529, -23.533773],
                [-46.62429, -23.534773],
                [-46.62329, -23.532773],
                [-46.62529, -23.533773],
              ],
            ],
          })
        )
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(401);
    });
  });

  describe('PUT /api/region', () => {
    it('should update a region', async () => {
      const response = await request
        .put(`/api/region/${region._id}`)
        .send(
          JSON.stringify({
            name: 'Polygon updated',
            coordinates: [
              [
                [-46.62436, -23.533373],
                [-46.62229, -23.532773],
                [-46.62529, -23.536773],
                [-46.62436, -23.533373],
              ],
            ],
          })
        )
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty(
        'message',
        'Region updated successfully'
      );
    });

    it('should error update a region', async () => {
      const response = await request
        .put(`/api/region/${region._id}`)
        .send(
          JSON.stringify({
            name: 'Polygon updated',
            coordinates: [
              [
                [-46.62436, -23.533373],
                [-46.62229, -23.532773],
                [-46.62529, -23.536773],
                [-46.62436, -23.533373],
              ],
            ],
          })
        )
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/region', () => {
    it('should list user regions', async () => {
      const response = await request
        .get('/api/region/')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
    });

    it('should error list user regions', async () => {
      const response = await request.get('/api/region/');

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/region/find', () => {
    it('should list regions on a specific point', async () => {
      const response = await request
        .get('/api/region/find/')
        .query({
          latitude: -46.62521,
          longitude: -23.533773,
        })
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
    });

    it('should error list regions on a specific point', async () => {
      const response = await request
        .get('/api/region/find/')
        .query({
          latitude: -46.62521,
          longitude: -23.533773,
        })
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/region/find-near', () => {
    it('should list regions in a certain distance from a point', async () => {
      const response = await request
        .get('/api/region/find-near')
        .query({
          latitude: -46.62521,
          longitude: -23.533773,
          distance: 1000,
          searchAll: false,
        })
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
    });

    it('should error list regions in a certain distance from a point', async () => {
      const response = await request
        .get('/api/region/find-near')
        .query({
          latitude: -46.62521,
          longitude: -23.533773,
          distance: 1000,
          searchAll: false,
        })
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/region/find-near', () => {
    it('should list regions in a certain distance from a point, from all users', async () => {
      const response = await request
        .get('/api/region/find-near')
        .query({
          latitude: -46.62521,
          longitude: -23.533773,
          distance: 1000,
          searchAll: true,
        })
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
    });

    it('should error list regions in a certain distance from a point, from all users', async () => {
      const response = await request
        .get('/api/region/find-near')
        .query({
          latitude: -46.62521,
          longitude: -23.533773,
          distance: 1000,
          searchAll: true,
        })
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(401);
    });
  });

  describe('DELETE /api/region', () => {
    it('should delete a region', async () => {
      const response = await request
        .delete(`/api/region/${region._id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
    });

    it('should error delete a region', async () => {
      const response = await request.delete(`/api/region/${region._id}`);

      expect(response.status).toBe(401);
    });
  });
});
