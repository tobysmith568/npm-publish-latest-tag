import { getInput, setFailed, setOutput } from "@actions/core";
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
  const packageJsonLocation = getInput("package-json");
  const registryUrl = await getNpmRegistryUrl();

  const latestTag = await getLatestTag(packageJsonLocation, registryUrl);

  setOutput("latest-tag", latestTag);
};

const handleErrorInGitHubAction = (error: any) => {
  if (!!error?.message) {
    setFailed(error.message);
    return;
  }

  if (typeof error === "string") {
    setFailed(error);
    return;
  }

  setFailed("Action failed with an unknown error");
};

(async () => {
  await main();
})();
