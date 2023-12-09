<p>
  <a href="https://www.npmjs.com/package/npm-publish-latest-tag">
    <img alt="npm" src="https://img.shields.io/npm/v/npm-publish-latest-tag?logo=npm">
  </a>

  <a href="https://github/tobysmith568/npm-publish-latest-tag/releases">
    <img alt="GitHub release (latest by date)" src="https://img.shields.io/github/v/release/tobysmith568/npm-publish-latest-tag?label=GitHub%20Action">
  </a>

  <a href="https://codecov.io/github/tobysmith568/npm-publish-latest-tag">
    <img alt="codecov" src="https://codecov.io/github/tobysmith568/npm-publish-latest-tag/branch/main/graph/badge.svg"/>
  </a>

  <a href="https://bundlephobia.com/package/npm-publish-latest-tag" target="_blank" alt="npm bundle size">
    <img alt="npm bundle size" src="https://img.shields.io/bundlephobia/min/npm-publish-latest-tag">
  </a>
</p>

# npm Publish Latest Tag

A library for getting a tag value to supply to the `npm publish` command so that updates to old major versions don't automatically get given the `latest` tag.

### Why use this?

If you provide no tags to the `npm publish` command then npm automatically gives that release the `latest` tag. The version with the `latest` tag is the one a user will get if they `npm install` without specifying a tag or a version.

This library returns a string for you to supply to the `npm publish` command with the `--tag` flag so that your current major version always keeps the `latest` tag.

Updates to older major versions will get a tag that is specific to that major version. Pre-releases/alphas/betas/etc will be tagged as such for their major version, no matter if it's an older, current, or newer major version.

### Examples

| Scenario                                        | Outputted tag value                                                                       | Example where current<br />version is 2.3.4 |
| ----------------------------------------------- | ----------------------------------------------------------------------------------------- | ------------------------------------------- |
| Publishing new major version                    | `latest`                                                                                  | `3.0.0` ➜ `latest`                          |
| Publishing minor/patch to current major release | `latest`                                                                                  | `2.4.0` ➜ `latest`                          |
| Publishing minor/patch to old major release     | `latest-X` where `X` is the major version                                                 | `1.4.5` ➜ `latest-1`                        |
| Publishing pre-release/alpha/beta/etc           | `latest-X-Y` where `X` is the major<br />version and `Y` is the first pre-release section | `3.0.0-beta` ➜ `latest-3-beta`              |

## Usage

To use this library, import it and run `getLatestTag`, passing in the location of the package.json for the npm package:

```javascript
var npmPublishLatestTag = require("npm-publish-latest-tag");

// ...
npmPublishLatestTag.getLatestTag("./package.json").then(tagToPublishWith => {
  //...
});
```

```typescript
import { getLatestTag } from "npm-publish-latest-tag";

// ...
const tagToPublishWith = await getLatestTag("./package.json");
//...
```

## License

npm-publish-latest-tag and npm-publish-latest-tag-github-action are licensed under the [ISC License](./LICENSE.md).
