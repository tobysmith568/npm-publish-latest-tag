import * as core from "@actions/core";
import { getLatestTag } from "npm-publish-latest-tag";
import { getNpmRegistryUrl } from "./utils/npm-registry";

const main = async () => {
  try {
    await runGitHubAction();
  } catch (error: any) {
    handleErrorInGitHubAction(error);
  }
};

const runGitHubAction = async () => {
  const packageJsonLocation = core.getInput("package-json");
  const registryUrl = await getNpmRegistryUrl();

  const latestTag = await getLatestTag(packageJsonLocation, registryUrl);

  core.setOutput("latestTag", latestTag);
};

const handleErrorInGitHubAction = (error: any) => {
  if (!!error?.message) {
    core.setFailed(error.message);
    return;
  }

  if (typeof error === "string") {
    core.setFailed(error);
    return;
  }

  core.setFailed("Action failed with an unknown error");
};

(async () => {
  await main();
})();
