import { FindOneOrFailOptions } from '@mikro-orm/core';
import { USER_ENTITY_FIELDS } from '../constants/user.constant';
import { UserEntity } from '../entities/user.entity';
import { getArticleEntityList } from '../repositories/article.repository';
import { getProductEntityList } from '../repositories/product.repository';
import {
  activateUserEntity,
  deactivateUserEntity,
  deleteUserEntity,
  getArchiveUser,
  getUserEntity,
  getUserEntityById,
  getUserEntityList,
  getUserReference,
  updateUserEntity,
} from '../repositories/users.repository';
import { GetArticleListRequest } from '../types/article.type';
import { Payload } from '../types/payload.type';
import { GetProductListRequest } from '../types/product.type';
import {
  ActivateUserRequest,
  DeactivateUserRequest,
  DeleteUserRequest,
  GetUserDetailRequset,
  GetUserListRequest,
  LockUserRequest,
  UnlockUserRequest,
  UpdateUserRequset,
} from '../types/user.type';
import { isUserMaster, isUserYourself } from '../utils/user.util';
import { sortToOrderBy } from '../utils/to.util';
import { comparePassword } from '../utils/password.util';
import { BadRequestError, ForbiddenError, UnauthorizedError } from '../types/error.type';
import { getImageReference } from '../repositories/images.repository';
import { getProductLikeEntityList } from '../repositories/product-like.repository';
import { getArticleLikeEntityList } from '../repositories/article-like.repository';
import { USER_STATUS } from '../enums/user.enum';
import { GetNotificationListRequest } from '../types/notification.type';
import { getNotificationEntityList } from '../repositories/notifications.repository';

export const getUserList = async (reqeust: GetUserListRequest) => {
  const { query } = reqeust;
  const { offset, limit, sort, keyword } = query;

  const where: Record<string, any> = {};

  if (keyword) {
    where.nickname = { $like: `${keyword}` };
  }

  const orderBy = sortToOrderBy(sort);

  const options = {
    offset,
    limit,
    orderBy,
  };

  const userList = await getUserEntityList(where, options);

  const data = {
    totalCount: userList[1],
    list: userList[0],
  };

  return data;
};

export const getUserDetail = async (user: Payload, request: GetUserDetailRequset) => {
  const { params } = request;

  const where = params;
  let fields: (keyof UserEntity)[] = USER_ENTITY_FIELDS.USER;
  let filters = true;

  if (isUserMaster(user)) {
    fields = USER_ENTITY_FIELDS.MASTER;
    filters = false;
  } else if (isUserYourself(user, params)) {
    fields = USER_ENTITY_FIELDS.YOURSELF;
  }

  const options: FindOneOrFailOptions<UserEntity> = {
    fields: fields as any,
    filters,
  };

  const exsitUser = await getUserEntity(where, options);

  return exsitUser;
};

export const updateUser = async (user: Payload, request: UpdateUserRequset) => {
  const { params, body } = request;
  const { nickname, email, password, imageId } = body;

  if (!isUserMaster(user) && !isUserYourself(user, params)) {
    throw new ForbiddenError();
  }
  const existUser = await getUserEntity(params);

  if (nickname) {
    existUser.nickname = nickname;
  }
  if (email) {
    existUser.email = email;
  }
  if (password) {
    existUser.password = password;
  }
  if (imageId) {
    const iamgeRef = await getImageReference(imageId);
    existUser.image = iamgeRef;
  }

  const updatedUser = await updateUserEntity(existUser);

  return updatedUser;
};

export const deactivateUser = async (request: DeactivateUserRequest) => {
  const { params } = request;

  return await deactivateUserEntity(params);
};

export const activateUser = async (request: ActivateUserRequest) => {
  const { params } = request;

  return await activateUserEntity(params);
};

export const lockUser = async (request: LockUserRequest) => {
  const { params } = request;

  const user = await getUserEntity(params);
  user.updatedAt = new Date();
  user.status = USER_STATUS.LOCK;

  await updateUserEntity(user);

  return user;
};

export const unlockUser = async (request: UnlockUserRequest) => {
  const { params } = request;

  const user = await getUserEntity(params);
  user.updatedAt = new Date();
  user.status = USER_STATUS.ACTIVE;
  user.loginAttempts = 0;

  await updateUserEntity(user);

  return user;
};

export const deleteUser = async (master: Payload, request: DeleteUserRequest) => {
  const { params, body } = request;
  const { password } = body;

  const masterUser = await getUserEntityById(master.id);
  if (masterUser === null) {
    throw new UnauthorizedError();
  }
  const isValidPassword = await comparePassword(password, masterUser.password);
  if (!isValidPassword) {
    throw new UnauthorizedError();
  }

  const archivedUser = await getArchiveUser();

  const data = { user: archivedUser };

  await deleteUserEntity(params, data);
};

export const getProductList = async (request: GetProductListRequest) => {
  const { params, query } = request;
  const { offset, limit, sort, keyword, isLiked } = query;
  const { id } = params;

  const where: Record<string, any> = {};

  if (id && isLiked !== undefined) {
    const productLikeList = await getProductLikeEntityList(
      { user: id },
      {
        populate: ['product'],
      }
    );

    const likedProductIdList = productLikeList.map((productLike) => productLike.product.id);

    if (likedProductIdList.length === 0) {
      return {
        totalCount: 0,
        list: [],
      };
    }

    where.id = { $in: likedProductIdList };
  } else if (id) {
    const userRef = await getUserReference(id);
    where.user = userRef;
  }

  if (keyword) {
    const query = { $like: `%${keyword}%` };
    where.$or = [{ title: query }, { description: query }];
  }

  const orderBy = sortToOrderBy(sort);

  const options = {
    offset,
    limit,
    orderBy,
  };

  const productList = await getProductEntityList(where, options);

  const data = {
    totalCount: productList[1],
    list: productList[0],
  };

  return data;
};

export const getArticleList = async (request: GetArticleListRequest) => {
  const { params, query } = request;
  const { offset, limit, sort, keyword, isLiked } = query;
  const { id } = params;

  const where: Record<string, any> = {};

  if (id && isLiked !== undefined) {
    const articleLikeList = await getArticleLikeEntityList(
      { user: id },
      {
        populate: ['article'],
      }
    );

    const likedArticleIdList = articleLikeList.map((articleLike) => articleLike.article.id);

    if (likedArticleIdList.length === 0) {
      return {
        totalCount: 0,
        list: [],
      };
    }

    where.id = { $in: likedArticleIdList };
  } else if (id) {
    const userRef = await getUserReference(id);
    where.user = userRef;
  }

  if (keyword) {
    where.title = { $like: `${keyword}` };
    where.description = { $like: `${keyword}` };
  }

  const orderBy = sortToOrderBy(sort);

  const options = {
    offset,
    limit,
    orderBy,
  };

  const articleList = await getArticleEntityList(where, options);

  const data = {
    totalCount: articleList[1],
    list: articleList[0],
  };

  return data;
};
