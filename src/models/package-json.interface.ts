export interface PackageJson {
  version: string;
}

export const isPackageJson = (subject: any): subject is PackageJson => {
  if (!subject) {
    return false;
  }

  if (typeof subject !== "object") {
    return false;
  }

  if (!subject.version) {
    return false;
  }

  return true;
};
