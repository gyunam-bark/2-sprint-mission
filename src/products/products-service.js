import { PRODUCT_STATUS } from '../constant/constant.js';
import prisma from '../prisma/prisma.js';
import {
  runActivateProductTransaction,
  runDectivateProductTransaction,
  runDeleteProductTransaction,
} from '../prisma/transaction.js';
import { HttpError } from '../util/error-util.js';
import { checkImageList } from '../util/image-util.js';
import { checkProductTagList, getExistProduct } from '../util/product-util.js';
import { toOrderBy } from '../util/to-util.js';
import { isUserMaster, isUserOwner } from '../util/user-util.js';
import { PRODUCTS_SELECT_MASTER, PRODUCTS_SELECT_OWNER, PRODUCTS_SELECT_USER } from './products-select.js';

export const createProduct = async (body, user) => {
  try {
    const id = user.id;
    const { name, description, price, stock, tags, images } = body;

    const tagsOption = checkProductTagList(tags);
    const imagesOption = checkImageList(images);

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
  } catch (error) {
    throw error;
  }
};

export const getProductList = async (query, user) => {
  try {
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

    const where = {
      ...keywordFilter,
      ...isLikedFilter,
    };

    const productList = await prisma.product.findMany({
      skip,
      take,
      orderBy,
      where,
    });

    const totalCount = await prisma.product.count({ where });

    return {
      totalCount: totalCount,
      data: productList,
    };
  } catch (error) {
    throw error;
  }
};

export const getProductDetail = async (param, user) => {
  try {
    const { id } = param;

    const existProduct = await getExistProduct({ id });

    if (existProduct.status === PRODUCT_STATUS.INACTIVE) {
      throw new HttpError(400, '존재하지 않는 제품입니다.');
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
  } catch (error) {
    throw error;
  }
};

export const updateProduct = async (param, body, user) => {
  try {
    const { id } = param;
    const { name, description, price, stock, tags, images } = body;

    const existProduct = await getExistProduct({ id });

    const tagsOption = checkProductTagList(tags);
    const imagesOption = checkImageList(images);

    if (!isUserMaster(user) && !isUserOwner(user.id, existProduct.id)) {
      throw new HttpError(400, '권한이 없습니다.');
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
  } catch (error) {
    throw error;
  }
};

export const deactivateProduct = async (param, user) => {
  try {
    const { id } = param;
    const existProduct = await getExistProduct({ id });

    if (!isUserMaster(user) && !isUserOwner(user.id, existProduct.id)) {
      throw new HttpError(400, '권한이 없습니다.');
    }

    const results = await runDectivateProductTransaction(existProduct.id);

    const deactivatedProduct = results.pop();

    return deactivatedProduct;
  } catch (error) {
    throw error;
  }
};

export const activateProduct = async (param) => {
  try {
    const { id } = param;
    const existProduct = await getExistProduct({ id });

    const results = await runActivateProductTransaction(existProduct.id);

    const activatedProduct = results.pop();

    return activatedProduct;
  } catch (error) {
    throw error;
  }
};

export const deleteProduct = async (param) => {
  try {
    const { id } = param;
    const existProduct = await getExistProduct({ id });

    const results = await runDeleteProductTransaction(existProduct.id);

    const deletedProduct = results.pop();

    return deletedProduct;
  } catch (error) {
    throw error;
  }
};
