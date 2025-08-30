import request from 'supertest';
import { app } from '../../src/app';
import { getEm } from '../../src/utils/mikro.util';
import { UserEntity } from '../../src/entities/user.entity';
import { RefreshTokenEntity } from '../../src/entities/refresh-token.entity';

describe('Auth', () => {
  let accessToken: string;
  let refreshToken: string;

  const email = 'auth@test.com';
  const password = 'password123';
  const nickname = 'authuser';

  beforeAll(async () => {
    const em = await getEm();
    await em.nativeDelete(RefreshTokenEntity, { user: { email } });
    await em.nativeDelete(UserEntity, { email });
  });

  it('회원가입 성공', async () => {
    const res = await request(app).post('/v1/auth/register').send({
      email,
      password,
      nickname,
    });
    expect(res.status).toBe(201);
  });

  it('회원가입 실패', async () => {
    const res = await request(app).post('/v1/auth/register').send({
      email,
      password,
      nickname,
    });
    expect(res.status).toBe(409);
  });

  it('로그인 성공', async () => {
    const res = await request(app).post('/v1/auth/login').send({
      email,
      password,
    });
    expect(res.status).toBe(200);

    accessToken = res.body.data.token;
    refreshToken = res.body.data.refreshToken;

    expect(accessToken).toBeDefined();
    expect(refreshToken).toBeDefined();
  });

  it('토큰 재발급 성공', async () => {
    const res = await request(app)
      .post('/v1/auth/refresh')
      .set('Cookie', `access-token=${accessToken}; refresh-token=${refreshToken}`)
      .send();

    expect(res.status).toBe(200);

    accessToken = res.body.data.token;
    refreshToken = res.body.data.refreshToken;

    expect(accessToken).toBeDefined();
    expect(refreshToken).toBeDefined();
  });

  it('로그아웃 성공', async () => {
    const res = await request(app)
      .post('/v1/auth/logout')
      .set('Cookie', `access-token=${accessToken}; refresh-token=${refreshToken}`)
      .send();

    expect(res.status).toBe(200);
  });

  it('회원 탈퇴 성공', async () => {
    const res = await request(app)
      .post('/v1/auth/withdraw')
      .set('Cookie', `access-token=${accessToken}; refresh-token=${refreshToken}`)
      .send({ password });

    expect([200, 204]).toContain(res.status);
  });
});
