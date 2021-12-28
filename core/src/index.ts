import greaterThan from "semver/functions/gt";
import getMajorVersion from "semver/functions/major";
import { getLatestVersion } from "./utils/npm-package";
import { getPackageJson } from "./utils/package-json";

export const getLatestTag = async (
  packageJsonPath: string,
  registryUrl: string
): Promise<string> => {
  const packageJson = await getPackageJson(packageJsonPath);
  const versionToPublish = packageJson.version;

  const currentPublishedVersion = await getLatestVersion(packageJson.name, registryUrl);

  if (!currentPublishedVersion) {
    return "latest";
  }

  const isVersionToPublishGreater = greaterThan(versionToPublish, currentPublishedVersion);
  if (isVersionToPublishGreater) {
    return "latest";
  }

  const versionToPublishMajorVersion = getMajorVersion(versionToPublish);
  return `latest-${versionToPublishMajorVersion}`;
};
