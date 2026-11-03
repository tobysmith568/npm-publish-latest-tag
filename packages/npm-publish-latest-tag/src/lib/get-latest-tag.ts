import { major as getMajorVersion, prerelease as semverPrerelease } from "semver";
import { getLatestVersion } from "./utils/npm-package";
import { getPackageJson } from "./utils/package-json";

const defaultRegistryUrl = "https://registry.npmjs.org";

export const getLatestTag = async (
  packageJsonPath: string,
  registryUrl: string = defaultRegistryUrl
): Promise<string> => {
  const packageJson = await getPackageJson(packageJsonPath);

  const localVersion = packageJson.version;
  const remoteVersion = await getLatestVersion(packageJson.name, registryUrl);

  if (!remoteVersion) {
    return "latest";
  }

  const localMajorVersion = getMajorVersion(localVersion);
  const remoteMajorVersion = getMajorVersion(remoteVersion);

  const localPrerelease = getPrerelease(localVersion);
  if (localPrerelease) {
    return `latest-${localMajorVersion}-${localPrerelease}`;
  }

  if (localMajorVersion < remoteMajorVersion) {
    return `latest-${localMajorVersion}`;
  }

  return "latest";
};

const getPrerelease = (version: string): string | undefined => {
  const prereleaseSections = semverPrerelease(version);

  if (!prereleaseSections || prereleaseSections.length === 0) {
    return undefined;
  }

  return "" + prereleaseSections[0];
};
