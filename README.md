<p>
  <a href="https://www.npmjs.com/package/npm-publish-latest-tag">
    <img alt="npm" src="https://img.shields.io/npm/v/npm-publish-latest-tag?logo=npm">
  </a>

  <a href="https://github/tobysmith568/npm-publish-latest-tag/releases">
    <img alt="GitHub release (latest by date)" src="https://img.shields.io/github/v/release/tobysmith568/npm-publish-latest-tag?label=GitHub%20Action">
  </a>

  <a href="https://codecov.io/github/tobysmith568/npm-publish-latest-tag">
    <img src="https://codecov.io/github/tobysmith568/npm-publish-latest-tag/branch/main/graph/badge.svg"/>
  </a>
</p>

# npm Publish Latest Tag GitHub Action

A Github Action for getting a tag value to supply to the `npm publish` command so that updates to old major versions don't automatically get given the `latest` tag.

### Why use this?

If you provide no tags to the `npm publish` command then npm automatically gives that release the `latest` tag. The version with the `latest` tag is the one a user will get if they `npm install` without specifying a tag or a version.

This Action returns a string for you to supply to the `npm publish` command with the `--tag` flag so that your current major version always keeps the `latest` tag.

Updates to older major versions will get a tag which is specific to that major version. Pre-releases/alphas/betas/etc will be tagged as such for their major version, no matter if it's an older, current, or newer major version.

### Inputs

- `package-json`: The path to the package.json file relative to the root of the repository

### Outputs

- `latest-tag`: The value to use for the `--tag` option in `npm publish`

## Usage

To use this Action, run it and then pass the output to the `npm publish` command.
Note the use of `id: latest_tag` so that the output can be used.

```yaml
- uses: tobysmith568/npm-publish-latest-tag@v1
  id: latest_tag
  with:
    package-json: ./package.json

- run: npm publish --tag ${{ steps.latest_tag.outputs.latest-tag }}
  env:
    NODE_AUTH_TOKEN: ${{ secrets.npm_token }}
```

## Results

| Scenario                                        | Result                                                                                    | Example where current<br />version is 2.3.4 |
| ----------------------------------------------- | ----------------------------------------------------------------------------------------- | ------------------------------ |
| Publishing new major version                    | `latest`                                                                                  | `3.0.0` ➜ `latest`             |
| Publishing minor/patch to current major release | `latest`                                                                                  | `2.4.0` ➜ `latest`             |
| Publishing minor/patch to old major release     | `latest-X` where `X` is the major version                                                 | `1.4.5` ➜ `latest-1`           |
| Publishing pre-release/alpha/beta/etc           | `latest-X-Y` where `X` is the major<br />version and `Y` is the first pre-release section | `3.0.0-beta` ➜ `latest-3-beta` |

## Contributing

This Action is written in TypeScript. Because GitHub Actions need to be in JavaScript, the compilation output for this repository is **not** gitignored and should be committed. When you run `npm install` a pre-commit git-hook will be configured using [`husky`](https://www.npmjs.com/package/husky) which will re-compile the build output, and stage the relevant changes for you.

Any PRs will be rebuilt in a CI process, if that build process creates a different build output to the contents of the PR, then it will fail.

## License (ISC)

Copyright (c) 2021, Toby Smith tobysmith568@hotmail.co.uk

Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
