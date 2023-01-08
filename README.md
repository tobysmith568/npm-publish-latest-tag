<p>
  <a href="https://www.npmjs.com/package/npm-publish-latest-tag">
    <img alt="npm" src="https://img.shields.io/npm/v/npm-publish-latest-tag?logo=npm">
  </a>

  <a href="https://github/tobysmith568/npm-publish-latest-tag/releases">
    <img alt="GitHub release (latest by date)" src="https://img.shields.io/github/v/release/tobysmith568/npm-publish-latest-tag?label=GitHub%20Action">
  </a>

  <a href="https://app.fossa.com/projects/custom%2B29651%2Fgithub.com%2Ftobysmith568%2Fnpm-publish-latest-tag?ref=badge_shield">
    <img alt="FOSSA Status" src="https://app.fossa.com/api/projects/custom%2B29651%2Fgithub.com%2Ftobysmith568%2Fnpm-publish-latest-tag.svg?type=shield"/>
  </a>

  <a href="https://codecov.io/github/tobysmith568/npm-publish-latest-tag">
    <img src="https://codecov.io/github/tobysmith568/npm-publish-latest-tag/branch/main/graph/badge.svg"/>
  </a>
</p>

# npm Publish Latest Tag GitHub Action

A Github Action for getting a tag value to supply to the `npm publish` command so that updates to old major versions don't automatically get given the `latest` tag.

> If you're looking for the npm package & CLI, you want this Readme: [./packages/npm-publish-latest-tag/README.md](./packages/npm-publish-latest-tag/README.md).

### Why use this?

If you provide no tags to the `npm publish` command then npm automatically gives that release the `latest` tag. The version with the `latest` tag is the one a user will get if they `npm install` without specifying a tag or a version.

This Action returns a string for you to supply to the `npm publish` command with the `--tag` flag so that your current major version always keeps the `latest` tag.

Updates to older major versions will get a tag that is specific to that major version. Pre-releases/alphas/betas/etc will be tagged as such for their major version, no matter if it's an older, current, or newer major version.

### Examples

| Scenario                                        | Outputted tag value                                                                       | Example where current<br />version is 2.3.4 |
| ----------------------------------------------- | ----------------------------------------------------------------------------------------- | ------------------------------------------- |
| Publishing new major version                    | `latest`                                                                                  | `3.0.0` ➜ `latest`                          |
| Publishing minor/patch to current major release | `latest`                                                                                  | `2.4.0` ➜ `latest`                          |
| Publishing minor/patch to old major release     | `latest-X` where `X` is the major version                                                 | `1.4.5` ➜ `latest-1`                        |
| Publishing pre-release/alpha/beta/etc           | `latest-X-Y` where `X` is the major<br />version and `Y` is the first pre-release section | `3.0.0-beta` ➜ `latest-3-beta`              |

## Usage

To use this Action, run it and then pass the output to the `npm publish` command.  
Note the use of `id: latest_tag` so that the output can be used.

### Inputs

- `package-json`: The path to the package.json file relative to the root of the repository

### Outputs

- `latest-tag`: The value to use for the `--tag` option in `npm publish`

```yaml
- uses: tobysmith568/npm-publish-latest-tag@v1
  id: latest_tag
  with:
    package-json: ./package.json

- run: npm publish --tag ${{ steps.latest_tag.outputs.latest-tag }}
  env:
    NODE_AUTH_TOKEN: ${{ secrets.npm_token }}
```

## Contributing

This Action is written in TypeScript. Because GitHub Actions need to be in JavaScript, the compilation output for this repository is **not** gitignored and should be committed. When you run `npm install` a pre-commit git-hook will be configured using [`husky`](https://www.npmjs.com/package/husky) which will re-compile the build output, and stage the relevant changes for you.

## License

npm-publish-latest-tag and npm-publish-latest-tag-github-action are licensed under the [ISC License](./LICENSE.md).

<a href="https://app.fossa.com/projects/custom%2B29651%2Fgithub.com%2Ftobysmith568%2Fnpm-publish-latest-tag?ref=badge_large">
  <img alt="FOSSA Status" src="https://app.fossa.com/api/projects/custom%2B29651%2Fgithub.com%2Ftobysmith568%2Fnpm-publish-latest-tag.svg?type=large"/>
</a>
