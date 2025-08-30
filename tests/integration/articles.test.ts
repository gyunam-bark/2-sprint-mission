import request from 'supertest';
import { app } from '../../src/app';
import { getEm } from '../../src/utils/mikro.util';
import { UserEntity } from '../../src/entities/user.entity';
import { RefreshTokenEntity } from '../../src/entities/refresh-token.entity';
import { ArticleEntity } from '../../src/entities/article.entity';
import { ArticleCommentEntity } from '../../src/entities/article-comment.entity';
import { ArticleLikeEntity } from '../../src/entities/article-like.entity';

describe('Articles API', () => {
  let accessToken: string;
  let articleId: string;

  const email = 'article@test.com';
  const password = 'password123';
  const nickname = 'articleuser';

  beforeAll(async () => {
    const em = await getEm();
    await em.nativeDelete(ArticleCommentEntity, { user: { email } });
    await em.nativeDelete(ArticleLikeEntity, { user: { email } });
    await em.nativeDelete(ArticleEntity, { user: { email } });
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

  it('게시글 목록 조회', async () => {
    const res = await request(app).get('/v1/articles').set('Authorization', `Bearer ${accessToken}`);
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty('totalCount');
    expect(Array.isArray(res.body.data.list)).toBe(true);
  });

  it('게시글 생성', async () => {
    const res = await request(app)
      .post('/v1/articles')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ title: '테스트 게시글', content: '테스트 내용' });

    expect(res.status).toBe(201);
    expect(res.body.data).toHaveProperty('id');
    articleId = res.body.data.id;
  });

  it('게시글 상세 조회', async () => {
    const res = await request(app).get(`/v1/articles/${articleId}`).set('Authorization', `Bearer ${accessToken}`);
    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe(articleId);
  });

  it('게시글 수정', async () => {
    const res = await request(app)
      .patch(`/v1/articles/${articleId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ title: '수정된 게시글' });

    expect(res.status).toBe(200);
    expect(res.body.data.title).toBe('수정된 게시글');
  });

  it('게시글 비활성화', async () => {
    const res = await request(app)
      .post(`/v1/articles/${articleId}/deactivate`)
      .set('Authorization', `Bearer ${accessToken}`);
    expect([200, 403]).toContain(res.status);
  });

  it('게시글 좋아요', async () => {
    const res = await request(app).post(`/v1/articles/${articleId}/like`).set('Authorization', `Bearer ${accessToken}`);
    expect([200, 201]).toContain(res.status);
  });

  it('게시글 댓글 생성', async () => {
    const res = await request(app)
      .post(`/v1/articles/${articleId}/comments`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ content: '첫 댓글' });

    expect(res.status).toBe(201);
    expect(res.body.data).toHaveProperty('id');
  });

  it('게시글 댓글 목록 조회', async () => {
    const res = await request(app)
      .get(`/v1/articles/${articleId}/comments`)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty('totalCount');
    expect(Array.isArray(res.body.data.list)).toBe(true);
  });

  it('게시글 활성화', async () => {
    const res = await request(app)
      .post(`/v1/articles/${articleId}/activate`)
      .set('Authorization', `Bearer ${accessToken}`);
    expect([403, 200]).toContain(res.status);
  });

  it('게시글 삭제', async () => {
    const res = await request(app)
      .delete(`/v1/articles/${articleId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ password });

    expect([403, 200, 204]).toContain(res.status);
  });
});
