import dotenv from 'dotenv';
import { sow } from './server/database/prisma.seed.mjs';
import Server from './server/server.mjs';

const main = async () => {
  try {
    // DOTENV 초기화
    dotenv.config();

    // 데이터베이스 SEED 작업
    // 순서 지켜야 함(의존성 고려)
    await sow({
      deleteFlow: ['product', 'productTag', 'productComment', 'article', 'articleTag', 'articleComment', 'image', 'user'],
      createFlow: ['user', 'image', 'productTag', 'product', 'productComment', 'articleTag', 'article', 'articleComment']
    });

    // SERVER 실행
    const server = new Server();
    server.run();
  } catch (error) {
    console.error(`server run failed: ${error}`);
    process.exit(1);
  }
}

main();