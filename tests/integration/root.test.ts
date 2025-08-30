import request from 'supertest';
import { app } from '../../src/app';

describe('Root API', () => {
  it('헬스 체크', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
  });
});
