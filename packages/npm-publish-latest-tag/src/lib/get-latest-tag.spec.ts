import axios, { type AxiosResponse } from "axios";
import { afterEach, beforeEach, describe, expect, it, spyOn } from "bun:test";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { getLatestTag } from "./get-latest-tag";

describe("getLatestTag", () => {
  const packageName = "package-name";
  const registryUrl = "https://registry.url.com";

  let directory: string;
  let packageJsonPath: string;
  let axiosGet: ReturnType<typeof spyOn<typeof axios, "get">>;

  const givenLocalVersion = async (version: string) => {
    await writeFile(packageJsonPath, JSON.stringify({ name: packageName, version }));
  };

  const givenRemoteVersion = (version: string | undefined) => {
    const response = { status: 200, data: { "dist-tags": { latest: version } } };
    axiosGet.mockResolvedValue(response as AxiosResponse);
  };

  beforeEach(async () => {
    directory = await mkdtemp(join(tmpdir(), "npm-publish-latest-tag-"));
    packageJsonPath = join(directory, "package.json");
    axiosGet = spyOn(axios, "get");
  });

  afterEach(async () => {
    axiosGet.mockRestore();
    await rm(directory, { recursive: true, force: true });
  });

  describe("registry url", () => {
    beforeEach(async () => {
      await givenLocalVersion("1.0.0");
      givenRemoteVersion("1.0.0");
    });

    it("should default to the public npm registry when none is given", async () => {
      await getLatestTag(packageJsonPath);

      expect(axiosGet).toHaveBeenCalledWith(
        `https://registry.npmjs.org/${packageName}`,
        expect.any(Object)
      );
    });

    it("should use the given registry url instead of the default", async () => {
      await getLatestTag(packageJsonPath, registryUrl);

      expect(axiosGet).toHaveBeenCalledWith(`${registryUrl}/${packageName}`, expect.any(Object));
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
        await givenLocalVersion(local);
        givenRemoteVersion(remote);

        const result = await getLatestTag(packageJsonPath, registryUrl);

        expect(result).toBe(expected);
      })
    );
  });
});
