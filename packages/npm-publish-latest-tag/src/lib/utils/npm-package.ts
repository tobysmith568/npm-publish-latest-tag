import axios from "axios";

const acceptHeader = "application/vnd.npm.install-v1+json; q=1.0, application/json; q=0.8, */*";

interface ResponseModel {
  "dist-tags": {
    latest?: string;
  };
}

export const getLatestVersion = async (
  packageName: string,
  registryUrl: string
): Promise<string | undefined> => {
  const getPath = `${registryUrl}/${packageName}`;

  try {
    const result = await axios.get<ResponseModel>(getPath, {
      headers: {
        Accept: acceptHeader
      }
    });

    if (result.status !== 200) {
      return undefined;
    }

    return result.data["dist-tags"]?.latest;
  } catch {
    return undefined;
  }
};
