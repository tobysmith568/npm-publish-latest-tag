import { getLatestTag } from "../src/index";
import { getLatestVersion } from "../src/utils/npm-package";
import { getPackageJson } from "../src/utils/package-json";

jest.mock("../src/utils/package-json");
jest.mock("../src/utils/npm-package");

describe("index", () => {
  const mockedGetPackageJson = jest.mocked(getPackageJson);
  const mockedGetLatestVersion = jest.mocked(getLatestVersion);

  const packageJsonPath = "./package.json";
  const registryUrl = "https://registry.npmjs.org";

  const packageName = "package-name";
  const remoteMajorVersion = "5";
  const remoteVersion = remoteMajorVersion + ".6.7";

  beforeEach(() => {
    jest.resetAllMocks();

    mockedGetLatestVersion.mockResolvedValue(remoteVersion);
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  describe("getLatestTag", () => {
    it("should pass the package.json path to getPackageJson", async () => {
      mockedGetPackageJson.mockResolvedValue({
        name: packageName,
        version: remoteVersion
      });

      await getLatestTag(packageJsonPath, registryUrl);

      expect(mockedGetPackageJson).toHaveBeenCalledWith(packageJsonPath);
    });

    it("should pass the package name to getLatestVersion", async () => {
      mockedGetPackageJson.mockResolvedValue({
        name: packageName,
        version: remoteVersion
      });

      await getLatestTag(packageJsonPath, registryUrl);

      expect(mockedGetLatestVersion).toHaveBeenCalledWith(packageName, expect.any(String));
    });

    it("should pass the registry url to getLatestVersion", async () => {
      mockedGetPackageJson.mockResolvedValue({
        name: packageName,
        version: remoteVersion
      });

      await getLatestTag(packageJsonPath, registryUrl);

      expect(mockedGetLatestVersion).toHaveBeenCalledWith(expect.any(String), registryUrl);
    });

    describe("when there is no remote version", () => {
      it("should return 'latest' when there is no remote version", async () => {
        mockedGetPackageJson.mockResolvedValue({
          name: packageName,
          version: remoteVersion
        });

        mockedGetLatestVersion.mockResolvedValue(undefined);

        const result = await getLatestTag(packageJsonPath, registryUrl);

        expect(result).toBe("latest");
      });
    });

    describe("when the local version is equal to the remote version", () => {
      it("should return 'latest' when the local version is equal to the remote version", async () => {
        mockedGetPackageJson.mockResolvedValue({
          name: packageName,
          version: remoteVersion
        });

        const result = await getLatestTag(packageJsonPath, registryUrl);

        expect(result).toBe("latest");
      });
    });

    describe("when the local major version is higher", () => {
      it("should return 'latest' when the local version is 1 patch version higher than the remote version", async () => {
        const higherPatchVersion = "5.6.8";

        mockedGetPackageJson.mockResolvedValue({
          name: packageName,
          version: higherPatchVersion
        });

        const result = await getLatestTag(packageJsonPath, registryUrl);

        expect(result).toBe("latest");
      });

      it("should return 'latest' when the local version is 1 minor version higher than the remote version", async () => {
        const higherMinorVersion = "5.7.7";

        mockedGetPackageJson.mockResolvedValue({
          name: packageName,
          version: higherMinorVersion
        });

        const result = await getLatestTag(packageJsonPath, registryUrl);

        expect(result).toBe("latest");
      });

      it("should return 'latest' when the local version is 1 major version higher than the remote version", async () => {
        const higherMajorVersion = "6.6.7";

        mockedGetPackageJson.mockResolvedValue({
          name: packageName,
          version: higherMajorVersion
        });

        const result = await getLatestTag(packageJsonPath, registryUrl);

        expect(result).toBe("latest");
      });
    });

    describe("when the local major version is lower", () => {
      [0, 1, 4].forEach(majorVersion =>
        it(`should return 'latest-${majorVersion}' when the local major version (${majorVersion}) is lower than the remote version`, async () => {
          const lowerMajorVersion = `${majorVersion}.0.0`;

          mockedGetPackageJson.mockResolvedValue({
            name: packageName,
            version: lowerMajorVersion
          });

          const result = await getLatestTag(packageJsonPath, registryUrl);

          expect(result).toBe(`latest-${majorVersion}`);
        })
      );
    });

    describe("pre-releases", () => {
      [
        { major: "0", preRelease: "-alpha" },
        { major: "0", preRelease: "-alpha.1" },
        { major: "0", preRelease: "-alpha.1+123" },
        { major: "1", preRelease: "-alpha" },
        { major: "1", preRelease: "-alpha.1" },
        { major: "1", preRelease: "-alpha.1+123" },
        { major: remoteMajorVersion, preRelease: "-alpha" },
        { major: remoteMajorVersion, preRelease: "-alpha.1" },
        { major: remoteMajorVersion, preRelease: "-alpha.1+123" },
        { major: "7", preRelease: "-alpha" },
        { major: "7", preRelease: "-alpha.1" },
        { major: "7", preRelease: "-alpha.1+123" }
      ].forEach(version =>
        it(`should always return with the major version (${version.major}) and first pre-release section when there's pre-release data (${version.preRelease})`, async () => {
          const { major, preRelease } = version;

          mockedGetPackageJson.mockResolvedValue({
            name: packageName,
            version: `${major}.0.0${preRelease}`
          });

          const result = await getLatestTag(packageJsonPath, registryUrl);

          expect(result).toBe(`latest-${major}-alpha`);
        })
      );

      it("should not use build metadata as a prerelease section", async () => {
        const higherMinorVersionWithBuildMetadata = "5.7.7+123";

        mockedGetPackageJson.mockResolvedValue({
          name: packageName,
          version: higherMinorVersionWithBuildMetadata
        });

        const result = await getLatestTag(packageJsonPath, registryUrl);

        expect(result).toBe("latest");
      });
    });
  });
});
