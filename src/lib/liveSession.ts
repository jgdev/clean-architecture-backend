import User, { UserStatus } from "@/core/entities/User";
import { bootstrapLogger } from "@/core/utils/logger";
import { ApiDeps } from "@/infrastructure/api";

export const checkLiveUser = async (deps: ApiDeps): Promise<User> => {
  const testUser = new User({
    balance: 10000,
    email: "test@test",
    status: UserStatus.ACTIVE,
  });
  await testUser.setPassword("test123");

  if (!(await deps.usersRepository.findAll({})).result.length) {
    await deps.usersRepository.create(testUser);
    bootstrapLogger.info(
      "Created live credentials:",
      testUser.email,
      "test123"
    );
  }

  return testUser;
};
