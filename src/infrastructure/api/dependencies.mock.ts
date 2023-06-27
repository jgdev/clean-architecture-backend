import { prepareTestEnvironment } from "@/test/unit/utils/InMemory.bootstrap";
import { ApiDeps } from ".";

export const getDependencies = async (): Promise<ApiDeps> => {
  const apiDependencies = await prepareTestEnvironment();

  return {
    ...apiDependencies,
    shutdown: async () => {},
  };
};
