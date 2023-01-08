export interface PackageJson {
  name: string;
  version: string;
}

export const isPackageJson = (subject: unknown): subject is PackageJson => {
  if (!subject) {
    return false;
  }

  if (typeof subject !== "object") {
    return false;
  }

  const subjectAsPackageJson = subject as PackageJson;

  if (!subjectAsPackageJson.name || typeof subjectAsPackageJson.name !== "string") {
    return false;
  }

  if (!subjectAsPackageJson.version || typeof subjectAsPackageJson.version !== "string") {
    return false;
  }

  return true;
};
