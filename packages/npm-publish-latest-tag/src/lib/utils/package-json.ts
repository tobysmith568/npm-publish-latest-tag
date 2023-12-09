import { readFile } from "fs";
import { isPackageJson, PackageJson } from "../models/package-json.interface";

const readFileAsync = (path: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    readFile(path, "utf-8", (err, data) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(data);
    });
  });
};

export const getPackageJson = async (path: string): Promise<PackageJson> => {
  try {
    const packageJsonAsString = await readFileAsync(path);
    const packageJson = JSON.parse(packageJsonAsString);

    if (!packageJson || !isPackageJson(packageJson)) {
      throw new Error("Invalid package.json");
    }

    return packageJson;
  } catch {
    throw new Error(`${path} is not a valid package.json`);
  }
};
