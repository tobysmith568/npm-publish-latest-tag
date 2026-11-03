import assert from "node:assert/strict";
import { getLatestTag, NpmPublishLatestTagError, PackageJsonError } from "npm-publish-latest-tag";

assert.equal(await getLatestTag("../higher-patch-version-than-v1/package.json"), "latest-1");
assert.equal(await getLatestTag("../higher-patch-version/package.json"), "latest");
assert.equal(await getLatestTag("../does-not-exist/package.json"), "latest");

await assert.rejects(getLatestTag("../invalid-path/package.json"), PackageJsonError);
await assert.rejects(getLatestTag("../invalid-path/package.json"), NpmPublishLatestTagError);

console.log(`import works on Node ${process.versions.node}`);
