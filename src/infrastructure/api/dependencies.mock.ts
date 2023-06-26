import { prepareTestEnvironment } from "@/test/unit/utils/InMemory.bootstrap";

export const getDependencies = async () => {
  const apiDependencies = await prepareTestEnvironment();
  return apiDependencies;
};
