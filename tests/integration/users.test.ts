import request from 'supertest';
import { app } from '../../src/app';
import { getEm } from '../../src/utils/mikro.util';
import { UserEntity } from '../../src/entities/user.entity';
import { RefreshTokenEntity } from '../../src/entities/refresh-token.entity';

describe('Users API', () => {
  let accessToken: string;
  let userId: string;

  const email = 'user@test.com';
  const password = 'password123';
  const nickname = 'usernick';

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

    // DB에서 userId 조회
    const user = await em.findOne(UserEntity, { email });
    if (user) {
      userId = user.id;
    }
  });

  it('사용자 목록 조회', async () => {
    const res = await request(app).get('/v1/users').set('Authorization', `Bearer ${accessToken}`);
    expect([200, 403]).toContain(res.status);
  });

  it('사용자 상세 조회 성공', async () => {
    const res = await request(app).get(`/v1/users/${userId}`).set('Authorization', `Bearer ${accessToken}`);
    expect(res.status).toBe(200);
    expect(res.body.data.email).toBe(email);
  });

  it('사용자 상세 조회 실패', async () => {
    const res = await request(app).get(`/v1/users/${userId}`);
    expect(res.status).toBe(401);
  });

  it('사용자 정보 수정', async () => {
    const res = await request(app)
      .patch(`/v1/users/${userId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ nickname: 'updatednick' });

    expect([200, 403]).toContain(res.status);
  });

  it('사용자 비활성화', async () => {
    const res = await request(app).post(`/v1/users/${userId}/deactivate`).set('Authorization', `Bearer ${accessToken}`);
    expect([403, 200]).toContain(res.status);
  });

  it('사용자 활성화', async () => {
    const res = await request(app).post(`/v1/users/${userId}/activate`).set('Authorization', `Bearer ${accessToken}`);
    expect([403, 200]).toContain(res.status);
  });

  it('사용자 잠금', async () => {
    const res = await request(app).post(`/v1/users/${userId}/lock`).set('Authorization', `Bearer ${accessToken}`);
    expect([403, 200]).toContain(res.status);
  });

  it('사용자 잠금 해제', async () => {
    const res = await request(app).post(`/v1/users/${userId}/unlock`).set('Authorization', `Bearer ${accessToken}`);
    expect([403, 200]).toContain(res.status);
  });

  it('사용자 상품 목록 조회', async () => {
    const res = await request(app).get(`/v1/users/${userId}/products`).set('Authorization', `Bearer ${accessToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty('totalCount');
    expect(Array.isArray(res.body.data.list)).toBe(true);
  });

  it('사용자 게시글 목록 조회', async () => {
    const res = await request(app).get(`/v1/users/${userId}/articles`).set('Authorization', `Bearer ${accessToken}`);
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty('totalCount');
    expect(Array.isArray(res.body.data.list)).toBe(true);
  });
});
