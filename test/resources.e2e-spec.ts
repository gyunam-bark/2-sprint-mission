import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';
import { resetDatabase } from './utils/db-utils';
import * as path from 'path';

describe('Resources (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let token: string;
  let folderId: number;
  let fileId: number;

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
      .send({ email: 'resource@test.com', password: '1234' })
      .expect(201);

    const signinRes = await request(app.getHttpServer())
      .post('/auth/signin')
      .send({ email: 'resource@test.com', password: '1234' })
      .expect(201);

    token = signinRes.body.accessToken;

    // 기본 폴더 생성
    const folderRes = await request(app.getHttpServer())
      .post('/resources/folders')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'default-folder' })
      .expect(201);

    folderId = folderRes.body.id;

    // 기본 파일 업로드
    const fileRes = await request(app.getHttpServer())
      .post('/resources/files')
      .set('Authorization', `Bearer ${token}`)
      .field('name', 'default.txt')
      .field('parentId', folderId)
      .attach('file', path.resolve(__dirname, 'samples/sample.txt'))
      .expect(201);

    fileId = fileRes.body.resource.id;
  });

  afterAll(async () => {
    await app.close();
  });

  it('폴더 생성', async () => {
    const res = await request(app.getHttpServer())
      .post('/resources/folders')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'test-folder' })
      .expect(201);

    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('name', 'test-folder');
    expect(res.body).toHaveProperty('type', 'folder');
  });

  it('파일 업로드 후 S3 반영 확인', async () => {
    const uploadRes = await request(app.getHttpServer())
      .post('/resources/files')
      .set('Authorization', `Bearer ${token}`)
      .field('name', 'upload-test.txt') // multipart form field
      .field('parentId', folderId.toString()) // 숫자는 문자열로 변환 필요
      .attach('file', path.resolve(__dirname, 'samples/sample.txt')) // 파일 첨부
      .expect(201);

    const uploadedFileId = uploadRes.body.resource.id;

    // 업로드 결과 검증
    expect(uploadRes.body).toHaveProperty('success', true);
    expect(uploadRes.body.resource).toHaveProperty('id', uploadedFileId);
    expect(uploadRes.body.resource).toHaveProperty('mimeType', 'text/plain');
    expect(uploadRes.body.resource).toHaveProperty('size');
    expect(uploadRes.body.resource).toHaveProperty('name', 'upload-test.txt');

    // presigned 다운로드 URL 확인
    const downloadRes = await request(app.getHttpServer())
      .get(`/resources/${uploadedFileId}/download`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(downloadRes.body).toHaveProperty('downloadUrl');
    expect(downloadRes.body.downloadUrl).toMatch(/^https?:\/\//);

    // presigned URL로 실제 파일 가져오기
    const fileRes = await fetch(downloadRes.body.downloadUrl);
    const text = await fileRes.text();

    expect(text).toContain('hello world');
  });

  it('파일에 댓글 작성 및 조회', async () => {
    const createRes = await request(app.getHttpServer())
      .post(`/resources/${fileId}/comments`)
      .set('Authorization', `Bearer ${token}`)
      .send({ text: '리소스 테스트 댓글' })
      .expect(201);

    expect(createRes.body).toHaveProperty('id');
    expect(createRes.body).toHaveProperty('text', '리소스 테스트 댓글');
    expect(createRes.body).toHaveProperty('author');

    const getRes = await request(app.getHttpServer())
      .get(`/resources/${fileId}/comments`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(Array.isArray(getRes.body)).toBe(true);
    expect(getRes.body.length).toBeGreaterThan(0);
    expect(getRes.body[0]).toHaveProperty('text', '리소스 테스트 댓글');
  });

  it('리소스를 휴지통으로 이동하고 조회', async () => {
    await request(app.getHttpServer())
      .post(`/resources/${fileId}/trash`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    const trashRes = await request(app.getHttpServer())
      .get('/resources/trash')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(Array.isArray(trashRes.body)).toBe(true);
    expect(trashRes.body.some((r: any) => r.id === fileId)).toBe(true);
  });

  it('휴지통에서 복원', async () => {
    await request(app.getHttpServer())
      .post(`/resources/${fileId}/trash`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    await request(app.getHttpServer())
      .post(`/resources/${fileId}/restore`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    const trashRes = await request(app.getHttpServer())
      .get('/resources/trash')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(trashRes.body.some((r: any) => r.id === fileId)).toBe(false);
  });

  it('휴지통에서 영구 삭제', async () => {
    await request(app.getHttpServer())
      .post(`/resources/${fileId}/trash`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    await request(app.getHttpServer())
      .delete(`/resources/${fileId}/permanent`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    const trashRes = await request(app.getHttpServer())
      .get('/resources/trash')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(trashRes.body.some((r: any) => r.id === fileId)).toBe(false);
  });
});
