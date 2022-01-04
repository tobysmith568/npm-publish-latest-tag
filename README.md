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

A GitHub Action step which returns a `latest-X` formatted tag to use when publishing npm packages.

If you provide no tags to the `npm publish` command then npm automatically gives it the `latest` tag. The version with the `latest` tag is the one which gets installed when no version is supplied.

This Action returns a string for you to supply to the `npm publish` command so that patches to old major versions don't automatically get given the `latest` tag.

To use this Action, run it and then pass the output to the `npm publish` command.  
Note the use of the `latest_tag` id so that the output can be used.

```yaml

- uses: tobysmith568/npm-publish-latest-tag@v1
  id: latest_tag
  with:
    package-json: ./package.json
    
- run: npm publish --access public --tag ${{ steps.latest_tag.outputs.latest-tag }}
        env:
          NODE_AUTH_TOKEN: ${{ secrets.npm_token }}
```
## Results
| Scenario                                        	| Result                                                                               	| Example where 2.3.4 is current  	|
|-------------------------------------------------	|--------------------------------------------------------------------------------------	|---------------------------------	|
| Publishing new major version                    	| `latest`                                                                             	| `3.0.0` ➜ `latest`             	|
| Publishing minor/patch to current major release 	| `latest`                                                                             	| `2.4.0` ➜ `latest`             	|
| Publishing minor/patch to old major release     	| `latest-X` where `X` is the major version                                            	| `1.4.5` ➜ `latest-1`           	|
| Publishing pre-release/alpha/beta/etc           	| `latest-X-Y` where `X` is the major<br />version and `Y` is the first pre-release section 	| `3.0.0-beta` ➜ `latest-3-beta` 	|
