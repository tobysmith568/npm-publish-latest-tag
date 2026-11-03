import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { getPackageJson } from "./package-json";
import { PackageJsonError } from "./package-json-error";

describe("getPackageJson", () => {
  let directory: string;
  let path: string;

  const givenPackageJson = async (contents: unknown) => {
    await writeFile(path, JSON.stringify(contents));
  };

  const getError = async () => {
    try {
      await getPackageJson(path);
    } catch (error) {
      return error;
    }

    throw new Error("Expected getPackageJson to throw");
  };

  beforeEach(async () => {
    directory = await mkdtemp(join(tmpdir(), "npm-publish-latest-tag-"));
    path = join(directory, "package.json");
  });

  afterEach(async () => {
    await rm(directory, { recursive: true, force: true });
  });

  it("should return the package.json", async () => {
    await givenPackageJson({ name: "package-name", version: "1.2.3" });

    const result = await getPackageJson(path);

    expect(result).toEqual({ name: "package-name", version: "1.2.3" });
  });

  it("should keep any other keys", async () => {
    await givenPackageJson({ name: "package-name", version: "1.2.3", private: true });

    const result = await getPackageJson(path);

    expect(result).toMatchObject({ private: true });
  });

  describe("when the package.json can't be read", () => {
    it("should throw a PackageJsonError if the file doesn't exist", async () => {
      const error = await getError();

      expect(error).toBeInstanceOf(PackageJsonError);
    });

    it("should say which file wasn't valid", async () => {
      const error = await getError();

      expect(error).toHaveProperty("message", `${path} is not a valid package.json`);
    });

    it("should keep the reason as the cause", async () => {
      const error = await getError();

      expect(error).toHaveProperty("cause");
    });

    it("should throw if the file isn't valid json", async () => {
      await writeFile(path, "This is not valid json");

      const error = await getError();

      expect(error).toBeInstanceOf(PackageJsonError);
    });
  });

  describe("when the package.json isn't valid", () => {
    const validName = "package-name";
    const validVersion = "1.2.3";

    const notObjects = [null, false, true, 0, 1, "", "string", []];

    notObjects.forEach(contents =>
      it(`should throw if it isn't an object (${JSON.stringify(contents)})`, async () => {
        await givenPackageJson(contents);

        const error = await getError();

        expect(error).toBeInstanceOf(PackageJsonError);
      })
    );

    it("should throw if it doesn't have a name", async () => {
      await givenPackageJson({ version: validVersion });

      const error = await getError();

      expect(error).toBeInstanceOf(PackageJsonError);
    });

    it("should throw if it doesn't have a version", async () => {
      await givenPackageJson({ name: validName });

      const error = await getError();

      expect(error).toBeInstanceOf(PackageJsonError);
    });

    const notNonEmptyStrings = [null, "", true, false, 0, 1, [], {}];

    notNonEmptyStrings.forEach(name =>
      it(`should throw if the name isn't a non-empty string (${JSON.stringify(name)})`, async () => {
        await givenPackageJson({ name, version: validVersion });

        const error = await getError();

        expect(error).toBeInstanceOf(PackageJsonError);
      })
    );

    notNonEmptyStrings.forEach(version =>
      it(`should throw if the version isn't a non-empty string (${JSON.stringify(version)})`, async () => {
        await givenPackageJson({ name: validName, version });

        const error = await getError();

        expect(error).toBeInstanceOf(PackageJsonError);
      })
    );
  });
});
