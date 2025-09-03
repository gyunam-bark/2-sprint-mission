import request from 'supertest';
import { app } from '../../src/app';
import { getEm } from '../../src/utils/mikro.util';
import { UserEntity } from '../../src/entities/user.entity';
import { RefreshTokenEntity } from '../../src/entities/refresh-token.entity';
import { ProductEntity } from '../../src/entities/product.entity';
import { ProductCommentEntity } from '../../src/entities/product-comment.entity';
import { ProductCommentLikeEntity } from '../../src/entities/product-comment-like.entity';

describe('Product Comments API', () => {
  let accessToken: string;
  let productId: string;
  let commentId: string;

  const email = 'prodcomment@test.com';
  const password = 'password123';
  const nickname = 'prodcommentuser';

  beforeAll(async () => {
    const em = await getEm();
    await em.nativeDelete(ProductCommentLikeEntity, { user: { email } });
    await em.nativeDelete(ProductCommentEntity, { user: { email } });
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

    // 상품 생성
    const productRes = await request(app)
      .post('/v1/products')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ name: '댓글 테스트 상품', description: '상품 설명', price: 1000, stock: 5 });

    productId = productRes.body.data.id;

    // 댓글 생성
    const commentRes = await request(app)
      .post(`/v1/products/${productId}/comments`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ content: '첫 댓글' });

    commentId = commentRes.body.data.id;
  });

  it('상품 댓글 수정', async () => {
    const res = await request(app)
      .patch(`/v1/comments/product/${commentId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ content: '수정된 댓글' });

    expect(res.status).toBe(200);
    expect(res.body.data.content).toBe('수정된 댓글');
  });

  it('상품 댓글 비활성화', async () => {
    const res = await request(app)
      .post(`/v1/comments/product/${commentId}/deactivate`)
      .set('Authorization', `Bearer ${accessToken}`);
    expect([200, 403]).toContain(res.status);
  });

  it('상품 댓글 활성화', async () => {
    const res = await request(app)
      .post(`/v1/comments/product/${commentId}/activate`)
      .set('Authorization', `Bearer ${accessToken}`);
    expect([200, 403]).toContain(res.status);
  });

  it('상품 댓글 좋아요', async () => {
    const res = await request(app)
      .post(`/v1/comments/product/${commentId}/like`)
      .set('Authorization', `Bearer ${accessToken}`);
    expect([200, 201]).toContain(res.status);
  });

  it('상품 댓글 삭제', async () => {
    const res = await request(app)
      .delete(`/v1/comments/product/${commentId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ password });

    expect([200, 204, 403]).toContain(res.status);
  });
});
