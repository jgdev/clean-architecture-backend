#!/usr/bin/env node
import "@/infrastructure/api/bootstrap";
import prompt from "prompt";
import { bootstrapLogger } from "@/core/utils/logger";
import { getDependencies } from "@/infrastructure/api/dependencies";
import { getDependencies as getDependenciesMock } from "@/infrastructure/api/dependencies.mock";
import { isValidEmail } from "@/core/utils/validation";
import User, { UserStatus } from "@/core/entities/User";
import { ApiDeps } from "@/infrastructure/api";

const isMockArg =
  process.argv.indexOf("--mock") > -1 || !!process.env.SERVER_MOCK;

let deps: ApiDeps;
prompt.start();

const main = async () => {
  deps = await (isMockArg ? getDependenciesMock() : getDependencies());
  await new Promise((resolve, reject) => {
    prompt.get(
      {
        properties: {
          email: {
            conform(value, data) {
              return isValidEmail(value);
            },
            message: "Email (must be unique)",
            required: true,
          },
          password: {
            hidden: true,
            required: true,
          },
          balance: {
            message: "Initial user balance",
            default: 0,
            type: "number",
          },
        },
      },
      async (err, result) => {
        if (err) return reject(err);

        try {
          const user = new User({
            balance: Number(result.balance),
            email: String(result.email),
            status: UserStatus.ACTIVE,
          });
          await user.setPassword(String(result.password));
          console.log("Saving user ...");
          await deps.usersRepository.create(user);
        } catch (_err: any) {
          return reject(_err);
        }

        console.log("User created successfully");

        return resolve(result);
      }
    );
  });
};

main()
  .catch(bootstrapLogger.error)
  .finally(() => {
    deps.shutdown().catch(bootstrapLogger.error);
    prompt.stop();
  });
