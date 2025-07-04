import { Request } from 'express';
import { Payload } from '../types/payload.type';
import { USER_ROLE, USER_STATUS } from '../enums/user.enum';
import { UserEntity } from '../entities/user.entity';
import { UnauthorizedError } from '../types/error.type';

export const getUser = (req: Request): Payload => {
  const user = req.user;
  if (user !== undefined) {
    return user;
  }
  throw new UnauthorizedError();
};
export const setUser = (req: Request, user: Payload): Payload => (req.user = user);
export const isUserMaster = (user: Payload): boolean => user.role === USER_ROLE.MASTER;
export const isUserOwner = <T extends { user: { id: string } }>(user: Payload, entity: T): boolean => {
  const userId = user.id;
  const ownerId = entity.user.id;
  return userId === ownerId;
};
export const isUserYourself = <T extends { id?: string }>(user: Payload, target: T) => {
  const userId = user.id;
  const targetId = target.id;
  return userId === targetId;
};
export const isUserLock = (user: UserEntity) => user.status === USER_STATUS.LOCK;
export const isUserInactive = (user: UserEntity) => user.status === USER_STATUS.INACTIVE;
