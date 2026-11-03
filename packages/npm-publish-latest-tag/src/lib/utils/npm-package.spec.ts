import axios, { type AxiosResponse } from "axios";
import { afterEach, beforeEach, describe, expect, it, spyOn } from "bun:test";
import { getLatestVersion } from "./npm-package";

describe("npm package utils", () => {
  const packageName = "package-name";
  const registryUrl = "https://registry.url.com";

  let axiosGet: ReturnType<typeof spyOn<typeof axios, "get">>;

  const givenResponse = (response: Partial<AxiosResponse>) => {
    axiosGet.mockResolvedValue(response as AxiosResponse);
  };

  beforeEach(() => {
    axiosGet = spyOn(axios, "get");
    givenResponse({ status: 200, data: { "dist-tags": { latest: "1.0.0" } } });
  });

  afterEach(() => {
    axiosGet.mockRestore();
  });

  describe("getLatestVersion", () => {
    it("should call axios get with the registry url and package name", async () => {
      const fullUrl = `${registryUrl}/${packageName}`;

      await getLatestVersion(packageName, registryUrl);

      expect(axiosGet).toHaveBeenCalledWith(fullUrl, expect.any(Object));
    });

    it("should call axios get with the minimal accept header with json fallback", async () => {
      const acceptHeader =
        "application/vnd.npm.install-v1+json; q=1.0, application/json; q=0.8, */*";

      await getLatestVersion(packageName, registryUrl);

      expect(axiosGet).toHaveBeenCalledWith(expect.any(String), {
        headers: { Accept: acceptHeader }
      });
    });

    [0, 100, 201, 204, 301, 400, 401, 404, 500].forEach(status =>
      it(`should return undefined if the status (${status}) is not 200`, async () => {
        givenResponse({ status });

        const result = await getLatestVersion(packageName, registryUrl);

        expect(result).toBeUndefined();
      })
    );

    it("should return undefined if axios get throws", async () => {
      axiosGet.mockRejectedValue(new Error("axios get error"));

      const result = await getLatestVersion(packageName, registryUrl);

      expect(result).toBeUndefined();
    });

    it("should return the latest dist-tag if the status is 200", async () => {
      const latestVersion = "1.0.0";

      givenResponse({ status: 200, data: { "dist-tags": { latest: latestVersion } } });

      const result = await getLatestVersion(packageName, registryUrl);

      expect(result).toBe(latestVersion);
    });

    it("should return undefined if there is no latest dist-tag", async () => {
      givenResponse({ status: 200, data: { "dist-tags": { notLatest: "1.0.0" } } });

      const result = await getLatestVersion(packageName, registryUrl);

      expect(result).toBeUndefined();
    });

    it("should return undefined if there are no dist-tags", async () => {
      givenResponse({ status: 200, data: { "dist-tags": undefined } });

      const result = await getLatestVersion(packageName, registryUrl);

      expect(result).toBeUndefined();
    });
  });
});
