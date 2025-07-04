import { clearTable, closeOrm, initializeOrm } from '../utils/mikro.util';
import { seedUser } from './user.seed';

const seed = async (): Promise<void> => {
  await initializeOrm();
  await clearTable();

  // SEEDS
  await seedUser();

  await closeOrm();
};

seed();
