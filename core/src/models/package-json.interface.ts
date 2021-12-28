export interface PackageJson {
  name: string;
  version: string;
}

export const isPackageJson = (subject: any): subject is PackageJson => {
  if (!subject) {
    return false;
  }

  if (typeof subject !== "object") {
    return false;
  }

  if (!subject.name || typeof subject.name !== "string") {
    return false;
  }

  if (!subject.version || typeof subject.version !== "string") {
    return false;
  }

  return true;
};
