import { getInput, setFailed, setOutput } from "@actions/core";
import { getLatestTag, NpmPublishLatestTagError } from "npm-publish-latest-tag";
import { getNpmRegistryUrl } from "./lib/npm-registry";

const describeFailure = (error: unknown) => {
  if (error instanceof NpmPublishLatestTagError) {
    return error.message;
  }

  // Anything else is a bug, so keep the stack to make it reportable
  if (error instanceof Error) {
    return `Unexpected error: ${error.stack ?? error.message}`;
  }

  return "Action failed with an unknown error";
};

const run = async () => {
  try {
    const packageJsonLocation = getInput("package-json");
    const registryUrl = await getNpmRegistryUrl();

    const latestTag = await getLatestTag(packageJsonLocation, registryUrl);

    setOutput("latest-tag", latestTag);
  } catch (error) {
    setFailed(describeFailure(error));
  }
};

void run();
