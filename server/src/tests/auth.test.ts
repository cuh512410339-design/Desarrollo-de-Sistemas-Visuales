import setup, { teardown } from './setup';
import request from 'supertest';
import app from '../testApp';

beforeAll(async () => await setup());
afterAll(async () => await teardown());

describe('Auth', () => {
  test('register -> login flow', async () => {
    const email = `test+${Date.now()}@example.com`;
    const password = 'pass1234';

    const reg = await request(app).post('/api/auth/register').send({ email, password, name: 'Test' });
    expect(reg.status).toBe(201);
    expect(reg.body.token).toBeTruthy();

    const login = await request(app).post('/api/auth/login').send({ email, password });
    expect(login.status).toBe(200);
    expect(login.body.token).toBeTruthy();
  });
});