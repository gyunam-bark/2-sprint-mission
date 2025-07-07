import fs from 'fs/promises';
import path from 'path';
import database from './prisma.client.mjs';
import * as prismaProcess from './prisma.process.mjs';

const SEEDS_PATH = './server/database/seeds';

const insertJsonToPrisma = async (name = '') => {
  const fileName = `${name}.seed.json`;
  try {
    const filePath = path.resolve(SEEDS_PATH, fileName);
    const rawData = await fs.readFile(filePath, 'utf-8');
    const jsonDataList = JSON.parse(rawData);

    if (!Array.isArray(jsonDataList)) {
      throw new Error(`invalid json format: ${fileName}`);
    }

    await database.$transaction(async (tx) => {
      switch (name) {
        case 'user': {
          await prismaProcess.processUser(tx, name, jsonDataList);
          break;
        };
        case 'product': {
          await prismaProcess.processProduct(tx, name, jsonDataList);
          break;
        };
        case 'productComment': {
          await prismaProcess.processProductComment(tx, name, jsonDataList);
          break;
        };
        case 'article': {
          await prismaProcess.processArticle(tx, name, jsonDataList);
          break;
        };
        case 'articleComment': {
          await prismaProcess.processArticleComment(tx, name, jsonDataList);
          break;
        };
        case 'image': {
          await prismaProcess.processImage(tx, jsonDataList);
          break;
        };
        default: {
          await prismaProcess.processDefault(tx, name, jsonDataList);
          break;
        };
      };
    });

    console.log(`inserted ${fileName} successfully`);
  } catch (error) {
    console.error(`insert ${fileName} failed: ${error.message}`);
    throw error;
  }
};

export const sow = async ({ deleteFlow = [], createFlow = [] }) => {
  try {
    if (!Array.isArray(deleteFlow) || !Array.isArray(createFlow)) {
      throw new Error('deleteFlow and createFlow must be arrays');
    }

    await database.$transaction(async (tx) => {
      for (const name of deleteFlow) {
        if (typeof name !== 'string') { continue; }
        await tx[name].deleteMany();
      }
    });

    for (const name of createFlow) {
      if (typeof name !== 'string') { continue; }
      await insertJsonToPrisma(name);
    }

    console.log('seed process completed.');
  } catch (error) {
    console.error(`seed failed: ${error.message}`);
    throw error;
  } finally {
    await database.$disconnect();
  }
};
