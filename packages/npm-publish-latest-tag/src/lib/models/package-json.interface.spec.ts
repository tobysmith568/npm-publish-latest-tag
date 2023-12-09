import { isPackageJson, PackageJson } from "./package-json.interface";

describe("PackageJson interface", () => {
  const validPackageJson: PackageJson = {
    name: "package-name",
    version: "1.2.3"
  };

  const falsyStringValues: string[] = [undefined, null] as unknown[] as string[];
  const notObjectValues: Record<string, unknown>[] = [
    "",
    "string",
    true,
    false,
    1,
    [],
    () => undefined,
    Symbol()
  ] as unknown[] as Record<string, unknown>[];
  const notStringValues: string[] = [
    true,
    false,
    1,
    [],
    {},
    () => undefined,
    Symbol()
  ] as unknown[] as string[];

  describe("isPackageJson", () => {
    it("should return true for valid package.json", () => {
      const result = isPackageJson(validPackageJson);

      expect(result).toBe(true);
    });

    falsyStringValues.forEach(subject =>
      it(`should return false if the subject is falsy (${subject})`, () => {
        const result = isPackageJson(subject);

        expect(result).toBe(false);
      })
    );

    notObjectValues.forEach(subject =>
      it(`should return false if the subject is not an object (${JSON.stringify(subject)})`, () => {
        const result = isPackageJson(subject);

        expect(result).toBe(false);
      })
    );

    describe("name", () => {
      falsyStringValues.forEach(falsyName =>
        it(`should return false if the subject name is false (${falsyName})`, () => {
          const subjectWithFalsyName = validPackageJson;
          subjectWithFalsyName.name = falsyName;

          const result = isPackageJson(subjectWithFalsyName);

          expect(result).toBe(false);
        })
      );

      notStringValues.forEach(notStringName =>
        it(`should return false if the subject name is not a string (${JSON.stringify(
          notStringName
        )})`, () => {
          const subjectWithNotStringName = validPackageJson;
          subjectWithNotStringName.name = notStringName;

          const result = isPackageJson(subjectWithNotStringName);

          expect(result).toBe(false);
        })
      );
    });

    describe("version", () => {
      falsyStringValues.forEach(falsyVersion =>
        it(`should return false if the subject version is false (${falsyVersion})`, () => {
          const subjectWithFalsyVersion = validPackageJson;
          subjectWithFalsyVersion.version = falsyVersion;

          const result = isPackageJson(subjectWithFalsyVersion);

          expect(result).toBe(false);
        })
      );

      notStringValues.forEach(notStringVersion =>
        it(`should return false if the subject version is not a string (${JSON.stringify(
          notStringVersion
        )})`, () => {
          const subjectWithNotStringVersion = validPackageJson;
          subjectWithNotStringVersion.version = notStringVersion;

          const result = isPackageJson(subjectWithNotStringVersion);

          expect(result).toBe(false);
        })
      );
    });
  });
});
