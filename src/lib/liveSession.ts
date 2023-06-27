import User, { UserStatus } from "@/core/entities/User";
import { bootstrapLogger } from "@/core/utils/logger";
import { ApiDeps } from "@/infrastructure/api";

export const checkLiveUser = async (deps: ApiDeps): Promise<User> => {
  const usersCount =
    (await deps.usersRepository.findAll({})).result.length || 0;

  const testUser = new User({
    balance: 200,
    email: "test@test",
    status: UserStatus.ACTIVE,
  });
  await testUser.setPassword("test123");

  const test2User = new User({
    balance: 10000,
    email: "test2@test",
    status: UserStatus.ACTIVE,
  });
  await test2User.setPassword("test1234");

  if (usersCount < 2) {
    await deps.usersRepository.create(testUser);
    await deps.usersRepository.create(test2User);
    bootstrapLogger.info(
      "Created live credentials:",
      `users: ${testUser.email}, ${test2User.email}`,
      "password: test123"
    );
  }

  return testUser;
};
