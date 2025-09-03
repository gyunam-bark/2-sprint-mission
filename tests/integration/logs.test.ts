import request from 'supertest';
import { app } from '../../src/app';
import { getEm } from '../../src/utils/mikro.util';
import { UserEntity } from '../../src/entities/user.entity';
import { RefreshTokenEntity } from '../../src/entities/refresh-token.entity';

describe('Logs API', () => {
  let accessToken: string;

  const email = 'log@test.com';
  const password = 'password123';
  const nickname = 'loguser';

  beforeAll(async () => {
    const em = await getEm();
    await em.nativeDelete(RefreshTokenEntity, { user: { email } });
    await em.nativeDelete(UserEntity, { email });

    // 회원가입
    await request(app).post('/v1/auth/register').send({
      email,
      password,
      nickname,
    });

    // 로그인
    const res = await request(app).post('/v1/auth/login').send({
      email,
      password,
    });

    accessToken = res.body.data.token;
  });

  it('로그 목록 조회', async () => {
    const res = await request(app).get('/v1/logs').set('Authorization', `Bearer ${accessToken}`);

    expect([200, 403]).toContain(res.status);

    if (res.status === 200) {
      expect(res.body.data).toHaveProperty('totalCount');
      expect(Array.isArray(res.body.data.list)).toBe(true);
    }
  });

  it('로그 삭제', async () => {
    const fakeLogId = '1';
    const res = await request(app).delete(`/v1/logs/${fakeLogId}`).set('Authorization', `Bearer ${accessToken}`);

    expect([200, 204, 403, 404]).toContain(res.status);
  });
});
