import request from 'supertest';
import { app } from '../../src/app';
import { getEm } from '../../src/utils/mikro.util';
import { UserEntity } from '../../src/entities/user.entity';
import { RefreshTokenEntity } from '../../src/entities/refresh-token.entity';
import { ProductEntity } from '../../src/entities/product.entity';
import { ProductCommentEntity } from '../../src/entities/product-comment.entity';
import { ProductLikeEntity } from '../../src/entities/product-like.entity';

describe('Products API', () => {
  let accessToken: string;
  let productId: string;

  const email = 'prod@test.com';
  const password = 'password123';
  const nickname = 'produser';

  beforeAll(async () => {
    const em = await getEm();
    await em.nativeDelete(ProductCommentEntity, { user: { email } });
    await em.nativeDelete(ProductLikeEntity, { user: { email } });
    await em.nativeDelete(ProductEntity, { user: { email } });
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

  it('상품 목록 조회', async () => {
    const res = await request(app).get('/v1/products').set('Authorization', `Bearer ${accessToken}`);
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty('totalCount');
    expect(Array.isArray(res.body.data.list)).toBe(true);
  });

  it('상품 생성', async () => {
    const res = await request(app)
      .post('/v1/products')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ name: '테스트 상품', description: '테스트 설명', price: 1000, stock: 10 });

    expect(res.status).toBe(201);
    expect(res.body.data).toHaveProperty('id');
    productId = res.body.data.id;
  });

  it('상품 상세 조회', async () => {
    const res = await request(app).get(`/v1/products/${productId}`).set('Authorization', `Bearer ${accessToken}`);
    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe(productId);
  });

  it('상품 수정', async () => {
    const res = await request(app)
      .patch(`/v1/products/${productId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ name: '수정된 상품' });

    expect(res.status).toBe(200);
    expect(res.body.data.name).toBe('수정된 상품');
  });

  it('상품 비활성화', async () => {
    const res = await request(app)
      .post(`/v1/products/${productId}/deactivate`)
      .set('Authorization', `Bearer ${accessToken}`);
    expect([200, 403]).toContain(res.status);
  });

  it('상품 좋아요', async () => {
    const res = await request(app).post(`/v1/products/${productId}/like`).set('Authorization', `Bearer ${accessToken}`);
    expect([200, 201]).toContain(res.status);
  });

  it('상품 댓글 생성', async () => {
    const res = await request(app)
      .post(`/v1/products/${productId}/comments`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ content: '첫 댓글' });

    expect(res.status).toBe(201);
    expect(res.body.data).toHaveProperty('id');
  });

  it('상품 댓글 목록 조회', async () => {
    const res = await request(app)
      .get(`/v1/products/${productId}/comments`)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty('totalCount');
    expect(Array.isArray(res.body.data.list)).toBe(true);
  });

  it('상품 활성화', async () => {
    const res = await request(app)
      .post(`/v1/products/${productId}/activate`)
      .set('Authorization', `Bearer ${accessToken}`);
    expect([403, 200]).toContain(res.status);
  });

  it('상품 삭제', async () => {
    const res = await request(app)
      .delete(`/v1/products/${productId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ password });
    expect([403, 200, 204]).toContain(res.status);
  });
});
