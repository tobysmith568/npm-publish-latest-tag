import { getPackageJson } from "./utils/package-json";

export const getLatestTag = async (packageJsonPath: string): Promise<string> => {
  const packageJson = await getPackageJson(packageJsonPath);
  console.log(packageJson);

  return "TODO";
};
