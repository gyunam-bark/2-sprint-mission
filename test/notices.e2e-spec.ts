// test/notices.e2e-spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';
import { resetDatabase } from './utils/db-utils';
import { UserRole } from '../src/users/user.entity';

describe('Notices (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let token: string;
  let noticeId: number;

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

    // 유저 생성
    await request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        email: 'notice@test.com',
        password: '1234',
        role: UserRole.ADMIN,
      })
      .expect(201);

    // 로그인
    const signinRes = await request(app.getHttpServer())
      .post('/auth/signin')
      .send({ email: 'notice@test.com', password: '1234' })
      .expect(201);

    token = signinRes.body.accessToken;
  });

  afterAll(async () => {
    await app.close();
  });

  it('공지사항 생성', async () => {
    const res = await request(app.getHttpServer())
      .post('/notices')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: '첫 번째 공지', content: '공지 내용입니다.' })
      .expect(201);

    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('title', '첫 번째 공지');
    expect(res.body).toHaveProperty('content', '공지 내용입니다.');

    noticeId = res.body.id;
  });

  it('공지사항 목록 조회', async () => {
    await request(app.getHttpServer())
      .post('/notices')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: '공지 목록 테스트', content: '목록 테스트 내용' })
      .expect(201);

    const res = await request(app.getHttpServer())
      .get('/notices')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('공지사항 단일 조회', async () => {
    const createRes = await request(app.getHttpServer())
      .post('/notices')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: '조회 테스트', content: '조회할 공지 내용' })
      .expect(201);

    const res = await request(app.getHttpServer())
      .get(`/notices/${createRes.body.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(res.body).toHaveProperty('id', createRes.body.id);
    expect(res.body).toHaveProperty('title', '조회 테스트');
  });

  it('공지사항 수정', async () => {
    const createRes = await request(app.getHttpServer())
      .post('/notices')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: '수정 전 제목', content: '수정 전 내용' })
      .expect(201);

    const res = await request(app.getHttpServer())
      .put(`/notices/${createRes.body.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: '수정된 제목', content: '수정된 내용' })
      .expect(200);

    expect(res.body).toHaveProperty('title', '수정된 제목');
    expect(res.body).toHaveProperty('content', '수정된 내용');
  });

  it('공지사항 삭제', async () => {
    const createRes = await request(app.getHttpServer())
      .post('/notices')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: '삭제 테스트', content: '삭제할 공지' })
      .expect(201);

    await request(app.getHttpServer())
      .delete(`/notices/${createRes.body.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    await request(app.getHttpServer())
      .get(`/notices/${createRes.body.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(404);
  });
});
