const acceptHeader = "application/vnd.npm.install-v1+json; q=1.0, application/json; q=0.8, */*";

export const getLatestVersion = async (
  packageName: string,
  registryUrl: string
): Promise<string | undefined> => {
  const url = getPackageUrl(packageName, registryUrl);

  // Every way this can fail (no network, a package that isn't published yet, a registry that is
  // down or that answers with something unexpected) means "no published version", which makes the
  // caller treat this as a first publish rather than failing the whole release.
  try {
    const response = await fetch(url, { headers: { Accept: acceptHeader } });

    if (response.status !== 200) {
      return undefined;
    }

    const body: unknown = await response.json();

    return getLatestDistTag(body);
  } catch {
    return undefined;
  }
};

const getPackageUrl = (packageName: string, registryUrl: string) => {
  // `npm config get registry` ends with a slash, which would otherwise double up
  const registry = registryUrl.replace(/\/+$/, "");

  // A scoped name keeps its "@", but the "/" between the scope and the name has to be escaped
  const escapedName = packageName.replace("/", "%2F");

  return `${registry}/${escapedName}`;
};

const getLatestDistTag = (body: unknown): string | undefined => {
  if (typeof body !== "object" || body === null) {
    return undefined;
  }

  const distTags = (body as { "dist-tags"?: unknown })["dist-tags"];

  if (typeof distTags !== "object" || distTags === null) {
    return undefined;
  }

  const latest = (distTags as { latest?: unknown }).latest;

  return typeof latest === "string" ? latest : undefined;
};
