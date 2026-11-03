import { afterEach, beforeEach, describe, expect, it, spyOn } from "bun:test";
import { getLatestVersion } from "./get-latest-version";

describe("getLatestVersion", () => {
  const packageName = "package-name";
  const registryUrl = "https://registry.url.com";

  let fetchSpy: ReturnType<typeof spyOn<typeof globalThis, "fetch">>;

  const givenResponse = (response: Response) => {
    fetchSpy.mockResolvedValue(response);
  };

  const givenLatest = (latest: unknown) => {
    givenResponse(Response.json({ "dist-tags": { latest } }));
  };

  beforeEach(() => {
    fetchSpy = spyOn(globalThis, "fetch");
    givenLatest("1.0.0");
  });

  afterEach(() => {
    fetchSpy.mockRestore();
  });

  describe("request", () => {
    it("should fetch the package from the registry", async () => {
      await getLatestVersion(packageName, registryUrl);

      expect(fetchSpy).toHaveBeenCalledWith(`${registryUrl}/${packageName}`, expect.any(Object));
    });

    it("should not double up the slash when the registry url ends with one", async () => {
      await getLatestVersion(packageName, `${registryUrl}/`);

      expect(fetchSpy).toHaveBeenCalledWith(`${registryUrl}/${packageName}`, expect.any(Object));
    });

    it("should escape the slash in a scoped package name", async () => {
      await getLatestVersion("@scope/package-name", registryUrl);

      expect(fetchSpy).toHaveBeenCalledWith(
        `${registryUrl}/@scope%2Fpackage-name`,
        expect.any(Object)
      );
    });

    it("should ask for the minimal response with a json fallback", async () => {
      const acceptHeader =
        "application/vnd.npm.install-v1+json; q=1.0, application/json; q=0.8, */*";

      await getLatestVersion(packageName, registryUrl);

      expect(fetchSpy).toHaveBeenCalledWith(expect.any(String), {
        headers: { Accept: acceptHeader }
      });
    });
  });

  describe("result", () => {
    it("should return the latest dist-tag", async () => {
      givenLatest("2.3.4");

      const result = await getLatestVersion(packageName, registryUrl);

      expect(result).toBe("2.3.4");
    });

    // The body is valid on purpose, so that only the status can make this undefined
    [201, 202, 301, 400, 401, 404, 500].forEach(status =>
      it(`should return undefined if the status (${status}) is not 200`, async () => {
        givenResponse(Response.json({ "dist-tags": { latest: "1.0.0" } }, { status }));

        const result = await getLatestVersion(packageName, registryUrl);

        expect(result).toBeUndefined();
      })
    );

    it("should return undefined if the request fails", async () => {
      fetchSpy.mockRejectedValue(new Error("network error"));

      const result = await getLatestVersion(packageName, registryUrl);

      expect(result).toBeUndefined();
    });

    it("should return undefined if the body isn't valid json", async () => {
      givenResponse(new Response("This is not valid json", { status: 200 }));

      const result = await getLatestVersion(packageName, registryUrl);

      expect(result).toBeUndefined();
    });

    [null, "a string", 1, []].forEach(body =>
      it(`should return undefined if the body is not an object (${JSON.stringify(body)})`, async () => {
        givenResponse(Response.json(body));

        const result = await getLatestVersion(packageName, registryUrl);

        expect(result).toBeUndefined();
      })
    );

    [undefined, null, "a string", 1].forEach(distTags =>
      it(`should return undefined if the dist-tags are not an object (${JSON.stringify(distTags)})`, async () => {
        givenResponse(Response.json({ "dist-tags": distTags }));

        const result = await getLatestVersion(packageName, registryUrl);

        expect(result).toBeUndefined();
      })
    );

    it("should return undefined if there is no latest dist-tag", async () => {
      givenResponse(Response.json({ "dist-tags": { notLatest: "1.0.0" } }));

      const result = await getLatestVersion(packageName, registryUrl);

      expect(result).toBeUndefined();
    });

    [undefined, null, 1, true, {}].forEach(latest =>
      it(`should return undefined if the latest dist-tag is not a string (${JSON.stringify(latest)})`, async () => {
        givenLatest(latest);

        const result = await getLatestVersion(packageName, registryUrl);

        expect(result).toBeUndefined();
      })
    );
  });
});
