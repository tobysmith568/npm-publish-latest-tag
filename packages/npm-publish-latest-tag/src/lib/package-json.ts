import { readFile } from "node:fs/promises";
import { PackageJsonError } from "./package-json-error";

export interface PackageJson {
  name: string;
  version: string;
}

export const getPackageJson = async (path: string): Promise<PackageJson> => {
  const message = `${path} is not a valid package.json`;

  let contents: unknown;

  try {
    const fileContents = await readFile(path, "utf-8");
    contents = JSON.parse(fileContents);
  } catch (error) {
    throw new PackageJsonError(message, { cause: error });
  }

  if (!isPackageJson(contents)) {
    throw new PackageJsonError(message);
  }

  return contents;
};

const isPackageJson = (subject: unknown): subject is PackageJson => {
  if (typeof subject !== "object" || subject === null) {
    return false;
  }

  const { name, version } = subject as Record<string, unknown>;

  return isNonEmptyString(name) && isNonEmptyString(version);
};

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.length > 0;
