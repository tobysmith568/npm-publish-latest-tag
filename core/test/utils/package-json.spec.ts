import { readFile } from "fs";
import { mocked } from "ts-jest/utils";
import { getPackageJson } from "../../src/utils/package-json";

jest.mock("fs", () => ({
  readFile: jest.fn()
}));

describe("package.json utils", () => {
  const pathToPackageJson = "path/to/package.json";
  const mockedReadFile = mocked(readFile);

  beforeEach(() => {
    jest.resetAllMocks();

    const mockImplementation: any = (path: string, encoding: string, callback: Function) => {
      callback(null, '{ "name": "test-package", "version": "1.2.3" }');
    };

    mockedReadFile.mockImplementation(mockImplementation);
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  describe("getPackageJson", () => {
    it("should pass the given path to fs readFile", async () => {
      await getPackageJson(pathToPackageJson);

      expect(mockedReadFile).toHaveBeenCalledWith(
        pathToPackageJson,
        expect.any(String),
        expect.any(Function)
      );
    });

    it("should pass utf-8 fs readFile", async () => {
      await getPackageJson(pathToPackageJson);

      expect(mockedReadFile).toHaveBeenCalledWith(
        expect.any(String),
        "utf-8",
        expect.any(Function)
      );
    });

    it("should throw if fs readFile calls the callback with an error", async () => {
      const error = new Error("fs readFile error");

      const mockImplementation: any = (path: string, encoding: string, callback: Function) => {
        callback(error, null);
      };
      mockedReadFile.mockImplementation(mockImplementation);

      expect(getPackageJson(pathToPackageJson)).rejects.toThrowError(
        "path/to/package.json is not a valid package.json"
      );
    });

    it("should throw if the package.json isn't valid json", async () => {
      const mockImplementation: any = (path: string, encoding: string, callback: Function) => {
        callback(null, "This is not valid json");
      };
      mockedReadFile.mockImplementation(mockImplementation);

      expect(getPackageJson(pathToPackageJson)).rejects.toThrowError(
        "path/to/package.json is not a valid package.json"
      );
    });

    it("should throw if the package.json doesn't have a name key", async () => {
      const mockImplementation: any = (path: string, encoding: string, callback: Function) => {
        callback(null, '{ "version": "1.2.3" }');
      };
      mockedReadFile.mockImplementation(mockImplementation);

      expect(getPackageJson(pathToPackageJson)).rejects.toThrowError(
        "path/to/package.json is not a valid package.json"
      );
    });

    it("should throw if the package.json doesn't have a version key", async () => {
      const mockImplementation: any = (path: string, encoding: string, callback: Function) => {
        callback(null, '{ "name": "test-package" }');
      };
      mockedReadFile.mockImplementation(mockImplementation);

      expect(getPackageJson(pathToPackageJson)).rejects.toThrowError(
        "path/to/package.json is not a valid package.json"
      );
    });

    it("should return the parsed package.json", async () => {
      const packageJson = await getPackageJson(pathToPackageJson);

      expect(packageJson).toEqual({
        name: "test-package",
        version: "1.2.3"
      });
    });
  });
});
