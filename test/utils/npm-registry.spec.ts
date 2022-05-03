import { ExecOutput, getExecOutput } from "@actions/exec";
import { getNpmRegistryUrl } from "../../src/utils/npm-registry";

jest.mock("@actions/exec");

describe("npm registry utils", () => {
  const mockGetExecOutput = jest.mocked(getExecOutput);

  describe("getNpmRegistryUrl", () => {
    it("should call getExecOutput with the npm executable", async () => {
      mockGetExecOutput.mockResolvedValue({
        exitCode: 0,
        stdout: ""
      } as ExecOutput);

      await getNpmRegistryUrl();

      expect(mockGetExecOutput).toHaveBeenCalledWith("npm", expect.any(Array));
    });

    it("should call getExecOutput with the correct cli arguments", async () => {
      mockGetExecOutput.mockResolvedValue({
        exitCode: 0,
        stdout: ""
      } as ExecOutput);

      await getNpmRegistryUrl();

      expect(mockGetExecOutput).toHaveBeenCalledWith(expect.any(String), [
        "config",
        "get",
        "registry"
      ]);
    });

    [-5, -1, 1, 5].forEach(exitCode =>
      it(`should throw if the exitCode is not zero (${exitCode})`, async () => {
        mockGetExecOutput.mockResolvedValue({
          exitCode,
          stdout: ""
        } as ExecOutput);

        await expect(getNpmRegistryUrl()).rejects.toThrowError("Failed to get npm registry url: ");
      })
    );

    ["This is standard error output", "This is also standard error output"].forEach(stderr =>
      it("should throw if the exitCode is not zero with the standard error", async () => {
        mockGetExecOutput.mockResolvedValue({
          exitCode: -1,
          stderr
        } as ExecOutput);

        await expect(getNpmRegistryUrl()).rejects.toThrowError(
          `Failed to get npm registry url: ${stderr}`
        );
      })
    );

    it("should return the standard out when the exitCode is zero", async () => {
      const standardOut = "https://the.registry.url.com";

      mockGetExecOutput.mockResolvedValue({
        exitCode: 0,
        stdout: standardOut
      } as ExecOutput);

      const result = await getNpmRegistryUrl();

      expect(result).toEqual(standardOut);
    });

    it("should trim the returned the standard out when the exitCode is zero", async () => {
      const registryUrl = "https://the.registry.url.com";
      const standardOut = `\r\n\t\t   ${registryUrl}   \t\t\r\n`;

      mockGetExecOutput.mockResolvedValue({
        exitCode: 0,
        stdout: standardOut
      } as ExecOutput);

      const result = await getNpmRegistryUrl();

      expect(result).toEqual(registryUrl);
    });
  });
});
