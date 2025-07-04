import { UserEntity } from '../entities/user.entity';
import { USER_ROLE, USER_STATUS } from '../enums/user.enum';
import { getEm } from '../utils/mikro.util';
import { hashPassword } from '../utils/password.util';

export const seedUser = async () => {
  const em = await getEm();

  const now = new Date();

  const baseUserData = {
    status: USER_STATUS.ACTIVE,
    createdAt: now,
    updatedAt: now,
    loginAttempts: 0,
  };

  const users = [
    em.create(UserEntity, {
      ...baseUserData,
      email: 'master@sprint.com',
      password: await hashPassword('master1234'),
      role: USER_ROLE.MASTER,
      nickname: 'master',
      isArchiveUser: false,
    }),
    em.create(UserEntity, {
      ...baseUserData,
      email: 'archive@sprint.com',
      password: await hashPassword('archive1234'),
      role: USER_ROLE.USER,
      nickname: 'archive',
      isArchiveUser: true,
    }),
  ];

  users.forEach((user) => em.persist(user));
  console.log('user 시드 생성 완료');
  await em.flush();
};
