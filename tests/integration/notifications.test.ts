import request from 'supertest';
import { app } from '../../src/app';
import { getEm } from '../../src/utils/mikro.util';
import { UserEntity } from '../../src/entities/user.entity';
import { RefreshTokenEntity } from '../../src/entities/refresh-token.entity';
import { NotificationEntity } from '../../src/entities/notification.entity';

describe('Notifications API', () => {
  let accessToken: string;
  let notificationId: string;

  const email = 'noti@test.com';
  const password = 'password123';
  const nickname = 'notiuser';

  beforeAll(async () => {
    const em = await getEm();
    await em.nativeDelete(NotificationEntity, { user: { email } });
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

    const user = await em.findOne(UserEntity, { email });
    if (user) {
      const notification = em.create(NotificationEntity, {
        user,
        message: '테스트 알림',
        isRead: false,
        createdAt: new Date(),
        deletedAt: null,
        readAt: null,
      });
      await em.persistAndFlush(notification);
      notificationId = notification.id;
    }
  });

  it('알림 목록 조회', async () => {
    const res = await request(app).get('/v1/notifications').set('Authorization', `Bearer ${accessToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty('totalCount');
    expect(Array.isArray(res.body.data.list)).toBe(true);
  });

  it('읽지 않은 알림 목록 조회', async () => {
    const res = await request(app).get('/v1/notifications/unread').set('Authorization', `Bearer ${accessToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty('totalCount');
    expect(Array.isArray(res.body.data.list)).toBe(true);
  });

  it('알림 상세 조회', async () => {
    const res = await request(app)
      .get(`/v1/notifications/${notificationId}`)
      .set('Authorization', `Bearer ${accessToken}`);

    expect([200, 404]).toContain(res.status);
    if (res.status === 200) {
      expect(res.body.data).toHaveProperty('id');
      expect(res.body.data).toHaveProperty('message');
    }
  });

  it('알림 읽음 처리', async () => {
    const res = await request(app)
      .patch(`/v1/notifications/${notificationId}`)
      .set('Authorization', `Bearer ${accessToken}`);

    expect([200, 404]).toContain(res.status);
    if (res.status === 200) {
      expect(res.body.data.isRead).toBe(true);
    }
  });
});
