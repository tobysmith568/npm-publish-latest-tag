import { major, prerelease } from "semver";
import { getLatestVersion } from "./get-latest-version";
import { getPackageJson } from "./package-json";

const defaultRegistryUrl = "https://registry.npmjs.org";

export const getLatestTag = async (
  packageJsonPath: string,
  registryUrl: string = defaultRegistryUrl
): Promise<string> => {
  const { name, version } = await getPackageJson(packageJsonPath);

  const remoteVersion = await getLatestVersion(name, registryUrl);

  // Nothing is published yet, so there is no existing "latest" to protect
  if (!remoteVersion) {
    return "latest";
  }

  const localMajor = major(version);

  const prereleaseLabel = getPrereleaseLabel(version);

  if (prereleaseLabel) {
    return `latest-${localMajor}-${prereleaseLabel}`;
  }

  const remoteMajor = major(remoteVersion);

  if (localMajor < remoteMajor) {
    return `latest-${localMajor}`;
  }

  return "latest";
};

/** The first section of a pre-release, e.g. `beta` for `1.2.3-beta.4` */
const getPrereleaseLabel = (version: string): string | undefined => {
  const sections = prerelease(version);

  const [firstSection] = sections ?? [];

  return firstSection === undefined ? undefined : String(firstSection);
};
