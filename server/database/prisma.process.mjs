import bcrypt from 'bcrypt';
import * as COMMON_DEFAULTS from '../common/common.default.mjs';
import fs from 'fs/promises';
import path from 'path';
import fscopy from 'fs-extra';
import crypto from 'crypto';

const STORAGE_IMAGE_PATH = './storage';
const SEED_IMAGE_PATH = './server/database/seeds';

// IMAGE.SEED.JSON
// 일일이 html form 으로 테스트하다 귀찮아서 만듬.
// multer(upload.mjs) 코드와 거의 유사.
export const processImage = async (tx, list) => {
  // 먼저 STORAGE_IMAGE_PATH 안의 이미지들을 모두 삭제
  try {
    const files = await fs.readdir(STORAGE_IMAGE_PATH);
    for (const file of files) {
      const filePath = path.join(STORAGE_IMAGE_PATH, file);
      await fs.unlink(filePath);
    }
  } catch (error) {
    console.error(`deleting existing images: ${error.message}`);
    throw error;
  }

  // list 에 있는 파일들을 추가
  for (const data of list) {
    const { file } = data;
    if (!file) {
      throw new Error('missing "file" field in image seed data');
    }

    const seedPath = path.resolve(SEED_IMAGE_PATH, file);

    const date = Date.now().toString();
    const ext = path.extname(file).substring(1);
    const baseName = path.basename(file, '.' + ext);
    const uniqueName = `${date}-${baseName}`;

    const id = crypto.randomUUID();
    const name = `${uniqueName}.${ext}`;
    const storagePath = path.resolve(STORAGE_IMAGE_PATH, name);

    // 복사해서 storage 에 저장
    await fscopy.copy(seedPath, storagePath);

    // 데이터베이스에 저장
    await tx.image.create({
      data: {
        id: id,
        name: name,
        url: `/storage/${name}.${ext}`,
        ext: ext
      }
    });
  }
};

// USER.SEED.JSON
export const processUser = async (tx, name, list) => {
  for (const data of list) {
    if (!data.email || !data.password) {
      throw new Error('skipping invalid user entry (missing email or password)');
    }

    const hashedPassword = await bcrypt.hash(data.password, COMMON_DEFAULTS.SALT_OR_ROUNDS_DEFAULT);
    data.password = hashedPassword;

    await tx.user.create({ data: data });
  }
};

// PROCESS.SEED.JSON
export const processProduct = async (tx, name, list) => {
  // 제품을 작성할 계정
  const masterUser = await tx.user.findUnique({ where: { email: 'master@sprint.com' } });
  if (!masterUser) {
    throw new Error('user not found for product seeding');
  }

  // 제품 태그 목록 
  const productTagList = await tx.productTag.findMany();
  if (productTagList.length === 0) {
    throw new Error('no product tags available');
  }

  // 이미지 목록
  const imageList = await tx.image.findMany();
  if (imageList.length === 0) {
    throw new Error('no iamge available');
  }

  for (const data of list) {
    // 작성자
    data.userId = masterUser.id;

    // 랜덤한 태그 하나 선정
    const randomTagId = Math.floor(Math.random() * productTagList.length);
    const randomProductTag = productTagList[randomTagId];
    data.tags = {
      connect: [{ id: randomProductTag.id }]
    };

    // 랜덤한 이미지 하나 선정
    const randomImageId = Math.floor(Math.random() * imageList.length);
    const randomImage = imageList[randomImageId];

    // 먼저 PRODUCT 생성 후 이미지 링크를 걸어야 함
    const createdProduct = await tx.product.create({ data: data });

    // 이미지 링크 생성
    await tx.productImageLink.create({
      data: {
        productId: createdProduct.id,
        imageId: randomImage.id
      }
    });
  }
};

// PROCESS_COMMENT.SEED.JSON
export const processProductComment = async (tx, name, list) => {
  // 제품 댓글을 작성할 계정
  const masterUser = await tx.user.findUnique({ where: { email: 'master@sprint.com' } });
  if (!masterUser) {
    throw new Error('user not found for product comment seeding');
  }

  // 제품 목록
  const productList = await tx.product.findMany();
  if (productList.length === 0) {
    throw new Error('no products available');
  }

  for (const data of list) {
    // 작성자
    data.userId = masterUser.id;

    // 등록할 제품
    const randomId = Math.floor(Math.random() * productList.length);
    const randomProduct = productList[randomId];
    data.productId = randomProduct.id;

    // 댓글 생성
    await tx.productComment.create({ data: data });
  }
}

// ARTICLE.SEED.JSON
export const processArticle = async (tx, name, list) => {
  // 테스트 게시글 작성할 계정
  const masterUser = await tx.user.findUnique({ where: { email: 'master@sprint.com' } });
  if (!masterUser) {
    throw new Error('user not found for article seeding');
  }

  // 테스트 게시글 태그 목록 
  const articleTagList = await tx.articleTag.findMany();
  if (articleTagList.length === 0) {
    throw new Error('no article tags available');
  }

  // 이미지 목록
  const imageList = await tx.image.findMany();
  if (imageList.length === 0) {
    throw new Error('no iamge available');
  }

  for (const data of list) {
    // 작성자 등록
    data.userId = masterUser.id;

    // 랜덤한 태그 하나 선정
    const randomTagId = Math.floor(Math.random() * articleTagList.length);
    const randomArticleTag = articleTagList[randomTagId];
    data.tags = {
      connect: [{ id: randomArticleTag.id }]
    };

    // 랜덤한 이미지 하나 선정
    const randomImageId = Math.floor(Math.random() * imageList.length);
    const randomImage = imageList[randomImageId];

    // 먼저 ARTICLE 생성 후 이미지 링크를 걸어야 함.
    const createdArticle = await tx.article.create({ data: data });

    // 이미지 링크 생성!
    await tx.articleImageLink.create({
      data: {
        articleId: createdArticle.id,
        imageId: randomImage.id
      }
    });
  }
};

// ARTICLE_COMMENT.SEED.JSON
export const processArticleComment = async (tx, name, list) => {
  // 게시글 댓글 작성할 계정
  const masterUser = await tx.user.findUnique({ where: { email: 'master@sprint.com' } });
  if (!masterUser) {
    throw new Error('user not found for product comment seeding');
  }

  // 게시글 목록
  const articleList = await tx.article.findMany();
  if (articleList.length === 0) {
    throw new Error('no article available');
  }

  for (const data of list) {
    // 작성자
    data.userId = masterUser.id;

    // 등록할 게시글
    const randomId = Math.floor(Math.random() * articleList.length);
    const randomArticle = articleList[randomId];
    data.articleId = randomArticle.id;

    // 댓글 생성
    await tx.articleComment.create({ data: data });
  }
}

// ETC
export const processDefault = async (tx, name, list) => {
  for (const data of list) {
    await tx[name].create({ data: data });
  }
};