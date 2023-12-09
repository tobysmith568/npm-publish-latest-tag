import axios from "axios";
import { getLatestVersion } from "./npm-package";

jest.mock("axios");

describe("npm package utils", () => {
  const packageName = "package-name";
  const registryUrl = "https://registry.url.com";

  const mockedAxiosGet = jest.mocked(axios.get);

  describe("getLatestVersion", () => {
    it("should call axios get with the registry url and package name", async () => {
      const fullUrl = `${registryUrl}/${packageName}`;

      await getLatestVersion(packageName, registryUrl);

      expect(mockedAxiosGet).toHaveBeenCalledWith(fullUrl, expect.any(Object));
    });

    it("should call axios get with the minimal accept header with json fallback", async () => {
      const acceptHeader =
        "application/vnd.npm.install-v1+json; q=1.0, application/json; q=0.8, */*";

      await getLatestVersion(packageName, registryUrl);

      expect(mockedAxiosGet).toHaveBeenCalledWith(expect.any(String), {
        headers: { Accept: acceptHeader }
      });
    });

    [0, 100, 201, 204, 301, 400, 401, 404, 500].forEach(status =>
      it(`should return undefined if the status (${status}) is not 200`, async () => {
        mockedAxiosGet.mockResolvedValueOnce({
          status
        });

        const result = await getLatestVersion(packageName, registryUrl);

        expect(result).toBeUndefined();
      })
    );

    it("should return undefined if axios get throws", async () => {
      mockedAxiosGet.mockRejectedValueOnce(new Error("axios get error"));

      const result = await getLatestVersion(packageName, registryUrl);

      expect(result).toBeUndefined();
    });

    it("should return the latest dist-tag if the status is 200", async () => {
      const latestVersion = "1.0.0";

      mockedAxiosGet.mockResolvedValueOnce({
        status: 200,
        data: {
          "dist-tags": {
            latest: latestVersion
          }
        }
      });

      const result = await getLatestVersion(packageName, registryUrl);

      expect(result).toBe(latestVersion);
    });

    it("should return undefined if there is no latest dist-tag", async () => {
      mockedAxiosGet.mockResolvedValueOnce({
        status: 200,
        data: {
          "dist-tags": {
            notLatest: "1.0.0"
          }
        }
      });

      const result = await getLatestVersion(packageName, registryUrl);

      expect(result).toBeUndefined();
    });

    it("should return undefined if there are no dist-tags", async () => {
      mockedAxiosGet.mockResolvedValueOnce({
        status: 200,
        data: {
          "dist-tags": undefined
        }
      });

      const result = await getLatestVersion(packageName, registryUrl);

      expect(result).toBeUndefined();
    });
  });
});
