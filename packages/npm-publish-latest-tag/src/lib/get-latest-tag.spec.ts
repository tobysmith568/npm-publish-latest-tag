import { getLatestTag } from "./get-latest-tag";
import { getLatestVersion } from "./utils/npm-package";
import { getPackageJson } from "./utils/package-json";

jest.mock("./utils/npm-package");
jest.mock("./utils/package-json");

describe("getLatestTag", () => {
  const packageJsonPath = "path/to/package.json";
  const registryUrl = "https://registry.url.com";

  const mockedGetLatestVersion = jest.mocked(getLatestVersion);
  const mockedGetPackageJson = jest.mocked(getPackageJson);

  const givenLocalVersion = (version: string) =>
    mockedGetPackageJson.mockResolvedValue({ name: "package-name", version });

  const givenRemoteVersion = (version: string | undefined) =>
    mockedGetLatestVersion.mockResolvedValue(version);

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe("registry url", () => {
    beforeEach(() => {
      givenLocalVersion("1.0.0");
      givenRemoteVersion("1.0.0");
    });

    it("should default to the public npm registry when none is given", async () => {
      await getLatestTag(packageJsonPath);

      expect(mockedGetLatestVersion).toHaveBeenCalledWith(
        "package-name",
        "https://registry.npmjs.org"
      );
    });

    it("should use the given registry url instead of the default", async () => {
      await getLatestTag(packageJsonPath, registryUrl);

      expect(mockedGetLatestVersion).toHaveBeenCalledWith("package-name", registryUrl);
    });

    it("should read the package.json from the given path", async () => {
      await getLatestTag(packageJsonPath, registryUrl);

      expect(mockedGetPackageJson).toHaveBeenCalledWith(packageJsonPath);
    });
  });

  describe("tag", () => {
    [
      { local: "1.0.0", remote: undefined, expected: "latest", name: "not yet published" },
      { local: "3.0.0", remote: "2.3.4", expected: "latest", name: "a new major" },
      { local: "2.4.0", remote: "2.3.4", expected: "latest", name: "a minor of the current major" },
      { local: "2.3.5", remote: "2.3.4", expected: "latest", name: "a patch of the current major" },
      { local: "1.4.5", remote: "2.3.4", expected: "latest-1", name: "a release of an old major" },
      {
        local: "3.0.0-beta",
        remote: "2.3.4",
        expected: "latest-3-beta",
        name: "a newer major pre-release"
      },
      {
        local: "2.4.0-alpha.1",
        remote: "2.3.4",
        expected: "latest-2-alpha",
        name: "a current major pre-release"
      },
      {
        local: "1.4.5-rc.0",
        remote: "2.3.4",
        expected: "latest-1-rc",
        name: "an old major pre-release"
      }
    ].forEach(({ local, remote, expected, name }) =>
      it(`should return ${expected} for ${name} (${local} vs ${remote})`, async () => {
        givenLocalVersion(local);
        givenRemoteVersion(remote);

        const result = await getLatestTag(packageJsonPath, registryUrl);

        expect(result).toBe(expected);
      })
    );
  });
});
