import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { getPackageJson } from "./package-json";

describe("package.json utils", () => {
  let directory: string;
  let pathToPackageJson: string;

  const givenPackageJson = async (contents: string) => {
    await writeFile(pathToPackageJson, contents);
  };

  beforeEach(async () => {
    directory = await mkdtemp(join(tmpdir(), "npm-publish-latest-tag-"));
    pathToPackageJson = join(directory, "package.json");
  });

  afterEach(async () => {
    await rm(directory, { recursive: true, force: true });
  });

  describe("getPackageJson", () => {
    it("should throw if the file doesn't exist", async () => {
      const result = getPackageJson(pathToPackageJson);

      await expect(result).rejects.toThrow(`${pathToPackageJson} is not a valid package.json`);
    });

    it("should throw if the package.json isn't valid json", async () => {
      await givenPackageJson("This is not valid json");

      const result = getPackageJson(pathToPackageJson);

      await expect(result).rejects.toThrow(`${pathToPackageJson} is not a valid package.json`);
    });

    it("should throw if the package.json doesn't have a name key", async () => {
      await givenPackageJson('{ "version": "1.2.3" }');

      const result = getPackageJson(pathToPackageJson);

      await expect(result).rejects.toThrow(`${pathToPackageJson} is not a valid package.json`);
    });

    it("should throw if the package.json doesn't have a version key", async () => {
      await givenPackageJson('{ "name": "test-package" }');

      const result = getPackageJson(pathToPackageJson);

      await expect(result).rejects.toThrow(`${pathToPackageJson} is not a valid package.json`);
    });

    it("should return the parsed package.json", async () => {
      await givenPackageJson('{ "name": "test-package", "version": "1.2.3" }');

      const packageJson = await getPackageJson(pathToPackageJson);

      expect(packageJson).toEqual({
        name: "test-package",
        version: "1.2.3"
      });
    });
  });
});
