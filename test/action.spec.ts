import { getInput, setFailed, setOutput } from "@actions/core";
import { getLatestTag } from "npm-publish-latest-tag";
import { mocked } from "ts-jest/utils";
import { getNpmRegistryUrl } from "../src/utils/npm-registry";

jest.mock("@actions/core");
jest.mock("npm-publish-latest-tag");
jest.mock("../src/utils/npm-registry");

describe("action", () => {
  const mockedGetInput = mocked(getInput);
  const mockedSetOutput = mocked(setOutput);
  const mockedSetFailed = mocked(setFailed);
  const mockedGetNpmRegistryUrl = mocked(getNpmRegistryUrl);
  const mockedGetLatestTag = mocked(getLatestTag);

  const packageJsonInput = "./package.json";
  const npmRegistryUrl = "https://the.registry.url.com";
  const latestTagValue = "latest";

  beforeEach(() => {
    jest.resetAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  describe("main", () => {
    it("should get the package-json input", async () => {
      jest.isolateModules(() => {
        jest.requireActual("../src/action");
      });

      expect(mockedGetInput).toHaveBeenCalledTimes(1);
      expect(mockedGetInput).toHaveBeenCalledWith("package-json");
    });

    it("should get the npm registry url", async () => {
      jest.isolateModules(() => {
        jest.requireActual("../src/action");
      });

      expect(mockedGetNpmRegistryUrl).toHaveBeenCalledTimes(1);
    });

    it("should call getLatestTag with the package.json location", async () => {
      mockedGetInput.mockReturnValue(packageJsonInput);
      mockedGetNpmRegistryUrl.mockResolvedValue(npmRegistryUrl);

      jest.isolateModules(() => {
        jest.requireActual("../src/action");
      });

      await cycleEventLoop();

      expect(mockedGetLatestTag).toHaveBeenCalledTimes(1);
      expect(mockedGetLatestTag).toHaveBeenCalledWith(packageJsonInput, expect.any(String));
    });

    it("should call getLatestTag with the npm registry url", async () => {
      mockedGetInput.mockReturnValue(packageJsonInput);
      mockedGetNpmRegistryUrl.mockResolvedValue(npmRegistryUrl);

      jest.isolateModules(() => {
        jest.requireActual("../src/action");
      });

      await cycleEventLoop();

      expect(mockedGetLatestTag).toHaveBeenCalledTimes(1);
      expect(mockedGetLatestTag).toHaveBeenCalledWith(expect.any(String), npmRegistryUrl);
    });

    it("should set the latest-tag output with the result of getLatestTag", async () => {
      mockedGetInput.mockReturnValue(packageJsonInput);
      mockedGetNpmRegistryUrl.mockResolvedValue(npmRegistryUrl);
      mockedGetLatestTag.mockResolvedValue("latest");

      jest.isolateModules(() => {
        jest.requireActual("../src/action");
      });

      await cycleEventLoop();

      expect(mockedSetOutput).toHaveBeenCalledTimes(1);
      expect(mockedSetOutput).toHaveBeenCalledWith("latest-tag", latestTagValue);
    });

    describe("errors", () => {
      it("should setFailed with the message of a thrown object if it's truthy", async () => {
        const errorMessage = "some error message";
        mockedGetNpmRegistryUrl.mockRejectedValue(new Error(errorMessage));

        jest.isolateModules(() => {
          jest.requireActual("../src/action");
        });

        await cycleEventLoop();

        expect(mockedSetFailed).toHaveBeenCalledTimes(1);
        expect(mockedSetFailed).toHaveBeenCalledWith(errorMessage);
      });

      it("should setFailed with a thrown object if it's a string", async () => {
        const errorMessage = "some error message";
        mockedGetNpmRegistryUrl.mockRejectedValue(errorMessage);

        jest.isolateModules(() => {
          jest.requireActual("../src/action");
        });

        await cycleEventLoop();

        expect(mockedSetFailed).toHaveBeenCalledTimes(1);
        expect(mockedSetFailed).toHaveBeenCalledWith(errorMessage);
      });

      it("should setFailed with a default error message if the thrown object has no message and isn't a string", async () => {
        mockedGetNpmRegistryUrl.mockRejectedValue({ thisObjectIsNotAnError: "or a string" });

        jest.isolateModules(() => {
          jest.requireActual("../src/action");
        });

        await cycleEventLoop();

        expect(mockedSetFailed).toHaveBeenCalledTimes(1);
        expect(mockedSetFailed).toHaveBeenCalledWith("Action failed with an unknown error");
      });

      [undefined, null, 0].forEach(thrown =>
        it(`should setFailed with a default error message if the thrown value is falsy (${thrown})`, async () => {
          mockedGetNpmRegistryUrl.mockRejectedValue(thrown);

          jest.isolateModules(() => {
            jest.requireActual("../src/action");
          });

          await cycleEventLoop();

          expect(mockedSetFailed).toHaveBeenCalledTimes(1);
          expect(mockedSetFailed).toHaveBeenCalledWith("Action failed with an unknown error");
        })
      );
    });
  });
});

const cycleEventLoop = () => new Promise(resolve => setTimeout(resolve, 0));
