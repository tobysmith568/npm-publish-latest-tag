import { getExecOutput } from "@actions/exec";
import { NpmPublishLatestTagError } from "npm-publish-latest-tag";

export const getNpmRegistryUrl = async (): Promise<string> => {
  // Without `ignoreReturnCode`, a failing npm makes this throw a generic exec error (with no
  // stderr) before the exitCode check below gets the chance to report it
  const result = await getExecOutput("npm", ["config", "get", "registry"], {
    ignoreReturnCode: true
  });

  if (result.exitCode !== 0) {
    throw new NpmPublishLatestTagError(`Failed to get npm registry url: ${result.stderr}`);
  }

  return result.stdout.trim();
};
