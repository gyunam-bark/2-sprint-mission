import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';
import { resetDatabase } from './utils/db-utils';
import * as path from 'path';

describe('Comments (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let token: string;
  let resourceId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    dataSource = moduleFixture.get(DataSource);
  });

  beforeEach(async () => {
    await resetDatabase(dataSource);

    // 유저 생성 & 로그인
    await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email: 'comment@test.com', password: '1234' })
      .expect(201);

    const signinRes = await request(app.getHttpServer())
      .post('/auth/signin')
      .send({ email: 'comment@test.com', password: '1234' })
      .expect(201);

    token = signinRes.body.accessToken;

    // 폴더 생성
    const folderRes = await request(app.getHttpServer())
      .post('/resources/folders')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'comment-folder' })
      .expect(201);

    const folderId = folderRes.body.id;

    // 파일 생성 + 업로드 (댓글 테스트 대상 리소스)
    const fileRes = await request(app.getHttpServer())
      .post('/resources/files')
      .set('Authorization', `Bearer ${token}`)
      .field('name', 'comment-test.txt')
      .field('parentId', folderId.toString())
      .attach('file', path.resolve(__dirname, 'samples/sample.txt'))
      .expect(201);

    resourceId = fileRes.body.resource.id;
  });

  afterAll(async () => {
    await app.close();
  });

  it('댓글 작성', async () => {
    const res = await request(app.getHttpServer())
      .post(`/resources/${resourceId}/comments`)
      .set('Authorization', `Bearer ${token}`)
      .send({ text: '첫 댓글!' })
      .expect(201);

    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('text', '첫 댓글!');
    expect(res.body).toHaveProperty('author');
  });

  it('댓글 조회', async () => {
    await request(app.getHttpServer())
      .post(`/resources/${resourceId}/comments`)
      .set('Authorization', `Bearer ${token}`)
      .send({ text: '조회용 댓글' })
      .expect(201);

    const res = await request(app.getHttpServer())
      .get(`/resources/${resourceId}/comments`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0]).toHaveProperty('text', '조회용 댓글');
  });

  it('댓글 수정', async () => {
    const createRes = await request(app.getHttpServer())
      .post(`/resources/${resourceId}/comments`)
      .set('Authorization', `Bearer ${token}`)
      .send({ text: '수정 전 댓글' })
      .expect(201);

    const commentId = createRes.body.id;

    const updateRes = await request(app.getHttpServer())
      .put(`/comments/${commentId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ text: '수정된 댓글' })
      .expect(200);

    expect(updateRes.body).toHaveProperty('id', commentId);
    expect(updateRes.body).toHaveProperty('text', '수정된 댓글');
  });

  it('댓글 삭제', async () => {
    const createRes = await request(app.getHttpServer())
      .post(`/resources/${resourceId}/comments`)
      .set('Authorization', `Bearer ${token}`)
      .send({ text: '삭제될 댓글' })
      .expect(201);

    const commentId = createRes.body.id;

    await request(app.getHttpServer())
      .delete(`/comments/${commentId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    const getRes = await request(app.getHttpServer())
      .get(`/resources/${resourceId}/comments`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    const texts = getRes.body.map((c: any) => c.text);
    expect(texts).not.toContain('삭제될 댓글');
  });
});
