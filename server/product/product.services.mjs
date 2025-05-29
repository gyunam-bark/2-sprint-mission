import database from '../database/prisma.client.mjs';
import * as PRISMA_CONSTANTS from '../database/prisma.constant.mjs';
import COMMON_SORTS from '../common/common.sort.mjs';
import COMMON_STATUSES from "../common/common.status.mjs";
import HTTP_STATUSES from '../common/http.status.mjs';
import * as permission from "../util/permission.util.mjs";
import { errorWithStatus } from '../util/error.util.mjs';


// SELECT
// MASTER 일 때는 모든 정보를 본다.
const SELECT_MASTER = {
  id: true,
  user: true,
  name: true,
  description: true,
  price: true,
  stock: true,
  tags: true,
  status: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
  images: true,
  comments: true
};

const SELECT_DELETE = {
  id: true,
  name: true
};

const getSelect = (isMaster) => {
  return isMaster
    ? SELECT_MASTER
    : {
      id: true,
      name: true,
      price: true,
      createdAt: true
    };
};

const getSelectDetail = (isMaster) => {
  return isMaster
    ? SELECT_MASTER
    : {
      id: true,
      name: true,
      description: true,
      price: true,
      tags: true,
      createdAt: true,
    };
};

export const getProductList = async (queries = {}, user = {}) => {
  const {
    offset, limit, sort, query, showInactive
  } = queries;

  // 오래된 순 : 오름차순(ㅇㄹ 자음이 같음ㅋ)
  const orderBy = sort === COMMON_SORTS.OLDEST
    ? { createdAt: PRISMA_CONSTANTS.ORDER_BY_ASCEND }
    : { createdAt: PRISMA_CONSTANTS.ORDER_BY_DESCEND };

  // 해당 유저가 MASTER 인지 확인
  const isMaster = permission.isMaster(user);

  // MASTER 권한일 때만 비활성화 PRODUCT 를 볼 수 있다.
  const inactiveFilter = showInactive && isMaster
    ? {}
    : { status: COMMON_STATUSES.ACTIVE };

  // query에 들어간 글자를 name 과 description 에서 검색한다.
  const queryFilter = query
    ? {
      OR: [
        { name: { contains: query, mode: PRISMA_CONSTANTS.CONTAINS_INSENSITIVE } },
        { description: { contains: query, mode: PRISMA_CONSTANTS.CONTAINS_INSENSITIVE } }
      ]
    }
    : {};

  const where = {
    ...inactiveFilter,
    ...queryFilter
  };

  const select = getSelect(isMaster);

  const productList = await database.product.findMany({
    skip: offset,
    take: limit,
    orderBy: orderBy,
    where: where,
    select: select
  });

  const totalCount = await database.product.count({ where: where });

  return {
    totalCount: totalCount,
    list: productList
  };
};

export const getProduct = async (params = {}, user = {}) => {
  const { id } = params;

  const isMaster = permission.isMaster(user);
  const select = getSelectDetail(isMaster);

  const product = await database.product.findUnique({
    where: { id: id },
    select: select
  });

  if (!product) {
    throw errorWithStatus(HTTP_STATUSES.FAIL_NOT_FOUND_404, 'product not found');
  }

  return product;
};

export const createProduct = async (body = {}, user = {}) => {
  const {
    name, description, price, tags, images
  } = body;

  // TAG 는 최소 하나
  const tagList = await database.productTag.findMany({
    where: { id: { in: tags } }
  });

  if (tagList.length !== tags.length) {
    throw errorWithStatus(HTTP_STATUSES.FAIL_BAD_REQUEST_400, 'no valid product tags found');
  }

  // IMAGE 는 선택사항
  let imageList = [];
  if (images) {
    imageList = await database.image.findMany({ where: { id: { in: images } } });
    if (imageList.length !== images.length) {
      throw errorWithStatus(HTTP_STATUSES.FAIL_NOT_FOUND_404, 'image not found');
    }
  }

  const createdProduct = await database.product.create({
    data: {
      name,
      description,
      price,
      user: { connect: { id: user.id } },
      tags: {
        connect: tags.map(id => ({ id }))
      }
    }
  });

  if (imageList.length > 0) {
    await database.productImageLink.createMany({
      data: imageList.map(image => ({
        productId: createdProduct.id,
        imageId: image.id
      })),
      skipDuplicates: true
    });
  }

  const isMaster = permission.isMaster(user);
  const select = getSelect(isMaster);

  const createdProductImageLinked = await database.product.findUnique({
    where: { id: createdProduct.id },
    select: select
  });

  return createdProductImageLinked;
};

export const updateProduct = async (params = {}, body = {}, user = {}) => {
  const { id } = params;
  const { tags, images } = body;

  await getProduct(params, user);

  // UPDATE에서 TAGS 는 선택사항
  if (tags) {
    const tagList = await database.productTag.findMany({ where: { id: { in: tags } } });
    if (tagList.length !== tags.length) {
      throw errorWithStatus(HTTP_STATUSES.FAIL_BAD_REQUEST_400, 'no valid product tags found');
    }
    body.tags = { set: tags.map(id => ({ id })) };
  }

  const updatedProduct = await database.product.update({
    where: { id },
    data: body,
    include: { tags: true }
  });

  // UPDATE에서 IMAGES 는 선택사항
  // 이미지 링크를 productId로 해야하기 때문에 product 생성 후에 진행한다.
  if (images) {
    // DELETE -> CREATE 까지 TRANSACTION 으로 처리.
    await database.$transaction(async (tx) => {
      const imageList = await tx.image.findMany({ where: { id: { in: images } } });

      if (imageList.length !== images.length) {
        throw errorWithStatus(HTTP_STATUSES.FAIL_NOT_FOUND_404, 'some image(s) not found');
      }

      await tx.productImageLink.deleteMany({ where: { productId: id } });

      await tx.productImageLink.createMany({
        data: imageList.map(image => ({
          productId: id,
          imageId: image.id,
        })),
        skipDuplicates: true,
      });
    });
  }

  const isMaster = permission.isMaster(user);
  const select = getSelect(isMaster);

  const updatedProductWithImageList = await database.product.findUnique({
    where: { id: updatedProduct.id },
    select: select
  });

  return updatedProductWithImageList;
};

export const deactivateProduct = async (params = {}, user = {}) => {
  const { id } = params;

  await getProduct(params, user);

  const isMaster = permission.isMaster(user);
  const select = getSelect(isMaster);

  const deactivatedProduct = await database.product.update({
    where: { id: id },
    data: {
      status: COMMON_STATUSES.INACTIVE,
      deletedAt: new Date()
    },
    select: select
  });

  return deactivatedProduct;
};

export const activateProduct = async (params = {}, user = {}) => {
  const { id } = params;

  await getProduct(params, user);

  const isMaster = permission.isMaster(user);
  const select = getSelect(isMaster);

  const activatedProduct = await database.product.update({
    where: { id: id },
    data: {
      status: COMMON_STATUSES.ACTIVE,
      deletedAt: null
    },
    select: select
  });

  return activatedProduct;
};

export const deleteProduct = async (params = {}, user = {}) => {
  const { id } = params;

  await getProduct(params, user);

  const deletedProduct = await database.product.delete({
    where: { id: id },
    select: SELECT_DELETE
  });

  return deletedProduct;
};