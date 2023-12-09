import { getExecOutput } from "@actions/exec";

export const getNpmRegistryUrl = async (): Promise<string> => {
  const result = await getExecOutput("npm", ["config", "get", "registry"]);

  if (result.exitCode !== 0) {
    throw new Error(`Failed to get npm registry url: ${result.stderr}`);
  }

  return result.stdout.trim();
};
