import { DataSource } from 'typeorm';

export async function resetDatabase(dataSource: DataSource) {
  // FK 순서 고려해서 TRUNCATE
  await dataSource.query(`
    TRUNCATE TABLE comments RESTART IDENTITY CASCADE;
    TRUNCATE TABLE resources RESTART IDENTITY CASCADE;
    TRUNCATE TABLE users RESTART IDENTITY CASCADE;
  `);
}
