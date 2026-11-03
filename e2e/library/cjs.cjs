const assert = require("node:assert/strict");
const { getLatestTag, PackageJsonError } = require("npm-publish-latest-tag");

const run = async () => {
  assert.equal(await getLatestTag("../higher-patch-version-than-v1/package.json"), "latest-1");
  assert.equal(await getLatestTag("../does-not-exist/package.json"), "latest");

  await assert.rejects(getLatestTag("../invalid-path/package.json"), PackageJsonError);

  console.log(`require works on Node ${process.versions.node}`);
};

run().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
