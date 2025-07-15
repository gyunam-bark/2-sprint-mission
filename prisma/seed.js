import prisma from '../src/prisma/prisma.js';
import ENV from '../src/config/env.js';
import { hashPassword } from '../src/util/crypt-util.js';

const userDataRaw = [ENV.MASTER_USER_DATA, ENV.ARCHIVE_USER_DATA];

const addUser = async (userDataRaw) => {
  try {
    const userDataList = userDataRaw.map((user) => JSON.parse(user));

    for (const userData of userDataList) {
      const existUser = await prisma.user.findUnique({
        where: { email: userData.email },
      });
      if (existUser) {
        console.log(`${userData.nickname} 계정이 이미 존재합니다.`);
        continue;
      }

      const hashedPassword = await hashPassword(userData.password);

      await prisma.user.create({
        data: {
          email: userData.email,
          nickname: userData.nickname,
          password: hashedPassword,
          role: userData.role,
          isArchiveUser: userData.isArchiveUser,
        },
      });

      console.log(`${userData.nickname} 계정이 생성되었습니다.`);
    }
  } catch (error) {
    console.error(error);
  }
};

const main = async () => {
  await addUser(userDataRaw);
};

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
