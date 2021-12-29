import { isPackageJson, PackageJson } from "../../src/models/package-json.interface";

describe("PackageJson interface", () => {
  const validPackageJson: PackageJson = {
    name: "package-name",
    version: "1.2.3"
  };

  const falsyValues = [undefined, null, 0];
  const notObjectValues = ["", "string", true, false, 1, [], () => undefined, Symbol()];
  const notStringValues = [true, false, 1, [], {}, () => undefined, Symbol()];

  describe("isPackageJson", () => {
    it("should return true for valid package.json", () => {
      const result = isPackageJson(validPackageJson);

      expect(result).toBe(true);
    });

    falsyValues.forEach(subject =>
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
      falsyValues.forEach(falsyName =>
        it(`should return false if the subject name is false (${falsyName})`, () => {
          const subjectWithFalsyName = validPackageJson as any;
          subjectWithFalsyName.name = falsyName;

          const result = isPackageJson(subjectWithFalsyName);

          expect(result).toBe(false);
        })
      );

      notStringValues.forEach(notStringName =>
        it(`should return false if the subject name is not a string (${JSON.stringify(
          notStringName
        )})`, () => {
          const subjectWithNotStringName = validPackageJson as any;
          subjectWithNotStringName.name = notStringName;

          const result = isPackageJson(subjectWithNotStringName);

          expect(result).toBe(false);
        })
      );
    });

    describe("version", () => {
      falsyValues.forEach(falsyVersion =>
        it(`should return false if the subject version is false (${falsyVersion})`, () => {
          const subjectWithFalsyVersion = validPackageJson as any;
          subjectWithFalsyVersion.version = falsyVersion;

          const result = isPackageJson(subjectWithFalsyVersion);

          expect(result).toBe(false);
        })
      );

      notStringValues.forEach(notStringVersion =>
        it(`should return false if the subject version is not a string (${JSON.stringify(
          notStringVersion
        )})`, () => {
          const subjectWithNotStringVersion = validPackageJson as any;
          subjectWithNotStringVersion.version = notStringVersion;

          const result = isPackageJson(subjectWithNotStringVersion);

          expect(result).toBe(false);
        })
      );
    });
  });
});
