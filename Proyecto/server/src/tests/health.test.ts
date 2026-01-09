import setup, { teardown } from './setup';
import request from 'supertest';
import app from '../testApp';

beforeAll(async () => {
  await setup();
});

afterAll(async () => {
  await teardown();
});

test('GET /api/health returns ok', async () => {
  const res = await request(app).get('/api/health');
  expect(res.status).toBe(200);
  expect(res.body.status).toBe('ok');
});