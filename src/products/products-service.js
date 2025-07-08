import { PRODUCT_STATUS } from '../constant/constant.js';
import prisma from '../prisma/prisma.js';
import {
  runActivateProductTransaction,
  runDectivateProductTransaction,
  runDeleteProductTransaction,
} from '../prisma/transaction.js';
import { comparePassword } from '../util/crypt-util.js';
import { ForbiddenError, NotFoundError } from '../util/error-util.js';
import { checkImageList } from '../util/image-util.js';
import { checkProductTagList, getExistProduct, toggleProductLike } from '../util/product-util.js';
import { toOrderBy } from '../util/to-util.js';
import { getMasterUser, isUserMaster, isUserOwner } from '../util/user-util.js';
import { PRODUCTS_SELECT_MASTER, PRODUCTS_SELECT_OWNER, PRODUCTS_SELECT_USER } from './products-select.js';

export const createProduct = async (body, user) => {
  const id = user.id;
  const { name, description, price, stock, tags, images } = body;

  const tagsOption = await checkProductTagList(tags);
  const imagesOption = await checkImageList(images);

  const createdProduct = await prisma.product.create({
    data: {
      name,
      description,
      price,
      stock,
      user: {
        connect: { id },
      },
      tags: tagsOption,
      images: imagesOption,
    },
  });

  return createdProduct;
};

export const getProductList = async (query, user) => {
  const id = user.id;
  const { skip, take, sort, keyword, isLiked } = query;

  const orderBy = toOrderBy(sort);

  const keywordFilter = keyword
    ? {
        userId: id,
        OR: [
          { name: { contains: keyword, mode: PRISMA_OPTION.INSENSITIVE } },
          { description: { contains: keyword, mode: PRISMA_OPTION.INSENSITIVE } },
        ],
      }
    : {};

  const isLikedFilter = isLiked
    ? {
        likes: {
          some: {
            userId: id,
          },
        },
      }
    : {};

  const include = {
    likes: {
      where: {
        userId: id,
      },
    },
  };

  const where = {
    ...keywordFilter,
    ...isLikedFilter,
  };

  const productList = await prisma.product.findMany({
    skip,
    take,
    orderBy,
    where,
    include,
  });

  const productListAddIsLiked = productList.map(({ likes, ...rest }) => ({
    ...rest,
    isLiked: likes.length > 0,
  }));

  const totalCount = await prisma.product.count({ where });

  return {
    totalCount: totalCount,
    data: productListAddIsLiked,
  };
};

export const getProductDetail = async (param, user) => {
  const { id } = param;

  const existProduct = await getExistProduct({ id });

  if (existProduct.status === PRODUCT_STATUS.INACTIVE) {
    throw new NotFoundError();
  }

  const queryOptions = {
    where: { id },
  };

  if (isUserMaster(user)) {
    queryOptions.select = PRODUCTS_SELECT_MASTER;
  } else if (isUserOwner(user.id, existProduct.id)) {
    queryOptions.select = PRODUCTS_SELECT_OWNER;
  } else {
    queryOptions.select = PRODUCTS_SELECT_USER;
  }

  const productDetail = await prisma.product.findUnique(queryOptions);

  return productDetail;
};

export const updateProduct = async (param, body, user) => {
  const { id } = param;
  const { name, description, price, stock, tags, images } = body;

  const existProduct = await getExistProduct({ id });

  const tagsOption = checkProductTagList(tags);
  const imagesOption = checkImageList(images);

  if (!isUserMaster(user) && !isUserOwner(user.id, existProduct.id)) {
    throw new ForbiddenError();
  }

  const updatedProduct = await prisma.product.update({
    where: { id: existProduct.id },
    data: {
      name,
      description,
      price,
      stock,
      tags: tagsOption,
      images: imagesOption,
    },
  });

  return updatedProduct;
};

export const deactivateProduct = async (param, user) => {
  const { id } = param;
  const existProduct = await getExistProduct({ id });

  if (!isUserMaster(user) && !isUserOwner(user.id, existProduct.id)) {
    throw new ForbiddenError();
  }

  const results = await runDectivateProductTransaction(existProduct.id);

  const deactivatedProduct = results.pop();

  return deactivatedProduct;
};

export const activateProduct = async (param) => {
  const { id } = param;
  const existProduct = await getExistProduct({ id });

  const results = await runActivateProductTransaction(existProduct.id);

  const activatedProduct = results.pop();

  return activatedProduct;
};

export const deleteProduct = async (param, body, master) => {
  const { id } = param;
  const { password } = body;

  const existProduct = await getExistProduct({ id });

  await comparePassword(password, master.password);

  const results = await runDeleteProductTransaction(existProduct.id);

  const deletedProduct = results.pop();

  return deletedProduct;
};

export const likeProduct = async (param, user) => {
  const { id } = param;

  const existProduct = await getExistProduct({ id });

  const likedProduct = await toggleProductLike(existProduct.id, user.id);

  return likedProduct;
};

export const getProductCommentList = async (param, query, user) => {
  const { id } = param;
  const { skip, take, sort, keyword, isLiked } = query;

  const existProduct = await getExistProduct({ id });

  const orderBy = toOrderBy(sort);

  const keywordFilter = keyword
    ? {
        productId: existProduct.id,
        OR: [{ comment: { contains: keyword, mode: PRISMA_OPTION.INSENSITIVE } }],
      }
    : {};

  const isLikedFilter = isLiked
    ? {
        likes: {
          some: {
            userId: user.id,
          },
        },
      }
    : {};

  const where = {
    ...keywordFilter,
    ...isLikedFilter,
  };

  const include = {
    likes: {
      where: {
        userId: id,
      },
    },
  };

  const productCommentList = await prisma.productComment.findMany({
    skip,
    take,
    orderBy,
    where,
    include,
  });

  const productCommentListAddIsLiked = productCommentList.map(({ likes, ...rest }) => ({
    ...rest,
    isLiked: likes.length > 0,
  }));

  const totalCount = await prisma.productComment.count({ where });

  return {
    totalCount: totalCount,
    data: productCommentListAddIsLiked,
  };
};

export const createProductComment = async (param, body, user) => {
  const { id } = param;
  const { content } = body;

  const existProduct = await getExistProduct({ id });

  const createdProductComment = await prisma.productComment.create({
    data: {
      content,
      user: {
        connect: { id: user.id },
      },
      product: {
        connect: { id: existProduct.id },
      },
    },
  });

  return createdProductComment;
};
