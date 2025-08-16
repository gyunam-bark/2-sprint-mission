import { ProductCommentEntity } from '../entities/product-comment.entity';
import { ProductImageLinkEntity } from '../entities/product-image-link.entity';
import { ProductLikeEntity } from '../entities/product-like.entity';
import { ProductTagEntity } from '../entities/product-tag.entity';
import { ProductEntity } from '../entities/product.entity';
import { PRODUCT_STATUS } from '../enums/product.enum';
import { getImageReference } from '../repositories/images.repository';
import { createNotificationEntity } from '../repositories/notifications.repository';
import { getProductCommentLikeEntityList } from '../repositories/product-comment-like.repository';
import { createProductCommentEntity, getProductCommentEntityList } from '../repositories/product-comment.repository';
import {
  createProductLikeEntity,
  deleteProductLikeEntity,
  getProductLikeEntity,
  getProductLikeEntityList,
  getUserListWhoLikedProduct,
} from '../repositories/product-like.repository';
import { getProductTagReference } from '../repositories/product-tag.repository';
import {
  activateProductEntity,
  createProductEntity,
  deactivateProductEntity,
  deleteProductEntity,
  getProductEntity,
  getProductEntityList,
  updateProductEntity,
} from '../repositories/product.repository';
import { getArchiveUser, getUserEntity, getUserEntityById, getUserReference } from '../repositories/users.repository';
import { ForbiddenError, UnauthorizedError } from '../types/error.type';
import { Payload } from '../types/payload.type';
import { CreateProductCommentRequest, GetProductCommentListRequest } from '../types/product-comment.type';
import {
  ActivateProductRequest,
  CreateProductRequest,
  DeactivateProductRequest,
  DeleteProductRequest,
  GetProductDetailRequest,
  GetProductListRequest,
  LikeProductRequest,
  UpdateProductRequest,
} from '../types/product.type';
import { comparePassword } from '../utils/password.util';
import { sortToOrderBy } from '../utils/to.util';
import { isUserMaster, isUserOwner } from '../utils/user.util';
import { io } from '../utils/websocket';

export const createProduct = async (user: Payload, request: CreateProductRequest) => {
  const { body } = request;
  const { name, description, price, stock, tags, images } = body;

  const product = new ProductEntity();
  product.name = name;
  product.description = description;
  product.price = price;
  product.stock = stock;

  product.user = await getUserReference(user.id);

  if (tags) {
    const tagRefs: ProductTagEntity[] = [];

    for (const tag of tags) {
      const tagRef = await getProductTagReference(tag);
      tagRefs.push(tagRef);
    }

    product.tags.set(tagRefs);
  }

  if (images) {
    for (const image of images) {
      const imageRef = await getImageReference(image);

      const linkEntity = new ProductImageLinkEntity();
      linkEntity.product = product;
      linkEntity.image = imageRef;

      product.images.add(linkEntity);
    }
  }

  const createdProduct = await createProductEntity(product);

  return createdProduct;
};

export const getProductList = async (user: Payload, request: GetProductListRequest) => {
  const { query } = request;
  const { offset, limit, sort, keyword, isLiked } = query;

  const where: Record<string, any> = {};

  if (isLiked !== undefined) {
    const productLikeList = await getProductLikeEntityList(
      { user: user.id },
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
  }

  if (keyword) {
    const query = { $like: `%${keyword}%` };
    where.$or = [{ name: query }, { description: query }];
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

export const getProductDetail = async (request: GetProductDetailRequest) => {
  const { params } = request;
  const product = await getProductEntity(params);

  return product;
};

export const updateProduct = async (user: Payload, request: UpdateProductRequest) => {
  const { params, body } = request;
  const { id } = params;
  const { name, description, price, stock, tags, images } = body;

  const product = await getProductEntity(params);

  const oldPrice = product.price;

  if (!isUserMaster(user) && !isUserOwner(user, product)) {
    throw new ForbiddenError();
  }

  if (name) {
    product.name = name;
  }
  if (description) {
    product.description = description;
  }
  if (price) {
    product.price = price;
  }
  if (stock) {
    product.stock = stock;
    if (stock === 0) {
      product.status = PRODUCT_STATUS.SOLD_OUT;
    } else {
      product.status = PRODUCT_STATUS.ACTIVE;
    }
  }
  if (tags) {
    const tagRefs: ProductTagEntity[] = [];

    for (const tag of tags) {
      const tagRef = await getProductTagReference(tag);
      tagRefs.push(tagRef);
    }

    product.tags.set(tagRefs);
  }
  if (images) {
    for (const image of images) {
      const imageRef = await getImageReference(image);

      const linkEntity = new ProductImageLinkEntity();
      linkEntity.product = product;
      linkEntity.image = imageRef;

      product.images.add(linkEntity);
    }
  }

  await updateProductEntity(product);

  if (price !== undefined && price !== oldPrice) {
    const likedUsers = await getUserListWhoLikedProduct(product.id);

    for (const likedUser of likedUsers) {
      const message = `좋아요한 상품 "${
        product.name
      }"의 가격이 ${oldPrice.toLocaleString()}원에서 ${price.toLocaleString()}원으로 변경되었습니다.`;

      await createNotificationEntity(likedUser.id, message);

      io.to(likedUser.id).emit('notice', { message });
    }
  }

  return product;
};

export const deactivateProduct = async (request: DeactivateProductRequest) => {
  const { params } = request;

  return await deactivateProductEntity(params);
};

export const activateProduct = async (request: ActivateProductRequest) => {
  const { params } = request;

  return await activateProductEntity(params);
};

export const deleteProduct = async (master: Payload, request: DeleteProductRequest) => {
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

  await deleteProductEntity(params, data);
};

export const likeProduct = async (user: Payload, request: LikeProductRequest) => {
  const { params } = request;

  const existUser = await getUserEntity({ id: user.id });
  const existProduct = await getProductEntity(params);
  const existLike = await getProductLikeEntity({ user: existUser });

  if (existLike === null) {
    const like = new ProductLikeEntity();
    like.user = existUser;
    like.product = existProduct;

    await createProductLikeEntity(like);
  } else {
    await deleteProductLikeEntity(existLike);
  }
};

export const createProductComment = async (user: Payload, request: CreateProductCommentRequest) => {
  const { params, body } = request;
  const { content } = body;

  const existUser = await getUserEntity({ id: user.id });
  const existProduct = await getProductEntity(params);

  const now = new Date();

  const productComment = new ProductCommentEntity();
  productComment.user = existUser;
  productComment.product = existProduct;
  productComment.content = content;
  productComment.createdAt = now;
  productComment.updatedAt = now;

  return await createProductCommentEntity(productComment);
};

export const getProductCommentList = async (user: Payload, request: GetProductCommentListRequest) => {
  const { params, query } = request;
  const { offset, limit, sort, keyword, isLiked } = query;

  const where: Record<string, any> = {};

  if (isLiked !== undefined && isLiked) {
    const productCommentLikeList = await getProductCommentLikeEntityList(
      { user: user.id, productComment: params.id },
      {
        populate: ['productComment'],
      }
    );

    const likedProductCommentIdList = productCommentLikeList.map(
      (productCommentLike) => productCommentLike.productComment.id
    );

    if (likedProductCommentIdList.length === 0) {
      return {
        totalCount: 0,
        list: [],
      };
    }

    where.id = { $in: likedProductCommentIdList };
  }

  if (keyword) {
    where.content = { $like: `${keyword}` };
  }

  const orderBy = sortToOrderBy(sort);

  const options = {
    offset,
    limit,
    orderBy,
  };

  const productCommentList = await getProductCommentEntityList(where, options);

  const data = {
    totalCount: productCommentList[1],
    list: productCommentList[0],
  };

  return data;
};