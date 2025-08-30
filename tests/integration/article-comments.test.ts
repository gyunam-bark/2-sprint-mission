import request from 'supertest';
import { app } from '../../src/app';
import { getEm } from '../../src/utils/mikro.util';
import { UserEntity } from '../../src/entities/user.entity';
import { RefreshTokenEntity } from '../../src/entities/refresh-token.entity';
import { ArticleEntity } from '../../src/entities/article.entity';
import { ArticleCommentEntity } from '../../src/entities/article-comment.entity';
import { ArticleCommentLikeEntity } from '../../src/entities/article-comment-like.entity';

describe('Article Comments API', () => {
  let accessToken: string;
  let articleId: string;
  let commentId: string;

  const email = 'comment@test.com';
  const password = 'password123';
  const nickname = 'commentuser';

  beforeAll(async () => {
    const em = await getEm();
    await em.nativeDelete(ArticleCommentLikeEntity, { user: { email } });
    await em.nativeDelete(ArticleCommentEntity, { user: { email } });
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

    // 게시글 생성
    const articleRes = await request(app)
      .post('/v1/articles')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ title: '댓글 테스트 글', content: '내용' });

    articleId = articleRes.body.data.id;

    // 댓글 생성
    const commentRes = await request(app)
      .post(`/v1/articles/${articleId}/comments`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ content: '첫 댓글' });

    commentId = commentRes.body.data.id;
  });

  it('게시글 댓글 수정', async () => {
    const res = await request(app)
      .patch(`/v1/comments/article/${commentId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ content: '수정된 댓글' });

    expect(res.status).toBe(200);
    expect(res.body.data.content).toBe('수정된 댓글');
  });

  it('게시글 댓글 비활성화', async () => {
    const res = await request(app)
      .post(`/v1/comments/article/${commentId}/deactivate`)
      .set('Authorization', `Bearer ${accessToken}`);
    expect([200, 403]).toContain(res.status);
  });

  it('게시글 댓글 활성화', async () => {
    const res = await request(app)
      .post(`/v1/comments/article/${commentId}/activate`)
      .set('Authorization', `Bearer ${accessToken}`);
    expect([200, 403]).toContain(res.status);
  });

  it('게시글 댓글 좋아요', async () => {
    const res = await request(app)
      .post(`/v1/comments/article/${commentId}/like`)
      .set('Authorization', `Bearer ${accessToken}`);
    expect([200, 201]).toContain(res.status);
  });

  it('게시글 댓글 삭제', async () => {
    const res = await request(app)
      .delete(`/v1/comments/article/${commentId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ password });

    expect([200, 204, 403]).toContain(res.status);
  });
});
