import * as core from "@actions/core";
import * as github from "@actions/github";

const main = async () => {
  try {
    await runGitHubAction();
  } catch (error: any) {
    handleErrorInGitHubAction(error);
  }
};

const runGitHubAction = async () => {
  const payload = JSON.stringify(github.context.payload, undefined, 2);
  console.log(`The event payload: ${payload}`);
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
