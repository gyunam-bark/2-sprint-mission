import { COMMON_SORT } from '../enums/common.enum';

export type UserQuery = { offset?: number; limit?: number; sort?: COMMON_SORT; keyword?: string };

export type UserParams = { id?: string };

export type UserUpdateBody = { email?: string; password?: string; nickname?: string; imageId?: string };

export type UserDeleteBody = { password: string };

export type GetUserListRequest = { query: UserQuery };

export type GetUserDetailRequset = { params: UserParams };

export type UpdateUserRequset = { params: UserParams; body: UserUpdateBody };

export type DeactivateUserRequest = { params: UserParams };

export type ActivateUserRequest = { params: UserParams };

export type LockUserRequest = { params: UserParams };

export type UnlockUserRequest = { params: UserParams };

export type DeleteUserRequest = { params: UserParams; body: UserDeleteBody };
