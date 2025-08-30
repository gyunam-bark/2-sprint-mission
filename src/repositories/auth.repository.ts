import { UserEntity } from '../entities/user.entity';
import { getEm } from '../utils/mikro.util';
import { RefreshTokenEntity } from '../entities/refresh-token.entity';
import { Payload } from '../types/payload.type';
import { getUserReference } from './users.repository';

export const createUserEntity = async (user: UserEntity) => {
  const em = await getEm();

  await em.persistAndFlush(user);

  return user;
};

export const createRefreshTokenEntity = async (refreshToken: RefreshTokenEntity): Promise<RefreshTokenEntity> => {
  const em = await getEm();

  await em.persistAndFlush(refreshToken);

  return refreshToken;
};

export const getRefreshTokenEntityById = async (id: string): Promise<RefreshTokenEntity> => {
  const em = await getEm();

  const userRef = await getUserReference(id);

  return await em.findOneOrFail(RefreshTokenEntity, { user: userRef });
};

export const getRefreshTokenEntity = async (user: UserEntity): Promise<RefreshTokenEntity | null> => {
  const em = await getEm();

  return await em.findOne(RefreshTokenEntity, { user: user });
};

export const updateRefreshTokenEntity = async (refreshToken: RefreshTokenEntity): Promise<RefreshTokenEntity> => {
  const em = await getEm();

  await em.persistAndFlush(refreshToken);

  return refreshToken;
};

export const deleteRefreshTokenEntity = async (user: Payload): Promise<void> => {
  const em = await getEm();

  const userRef = await getUserReference(user.id);

  const refreshToken = await em.findOne(RefreshTokenEntity, { user: userRef });

  if (refreshToken) {
    await em.removeAndFlush(refreshToken);
  } else {
    console.error(`no refresh token for [${user.id}]`);
  }
};
