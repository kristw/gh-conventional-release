# gh-conventional-release

Create releases on GitHub based on tags

This was forked and modified from <https://github.com/escaletech/circleci-gh-conventional-release>

## Usage

### Plain Node.js

```sh
GITHUB_URL="$GITHUB_URL" \
GITHUB_TOKEN="$GITHUB_TOKEN" \
TARGET_TAG="$CIRCLE_TAG" \
REPO_OWNER="$CIRCLE_PROJECT_USERNAME" \
REPO_NAME="$CIRCLE_PROJECT_REPONAME" \
CONTINUE_ON_ERROR="false" \
npx https://github.com/kristw/circleci-gh-conventional-release
```

This will result in a GitHub release like the following:

![image](https://github.com/kristw/circleci-gh-conventional-release/assets/1659771/3859c14f-a615-4449-9c7d-4eabf7aa2255)

### CircleCI

Environment variables used for default parameters:

- `GITHUB_TOKEN`
- `CIRCLE_TAG` (set by default in CircleCI when build is triggered by a tag push)
- `CIRCLE_PROJECT_USERNAME` (set by default in CircleCI)
- `CIRCLE_PROJECT_REPONAME` (set by default in CircleCI)

Assuming an environment with all the required variables, usage consists of simply calling the `create-release` job or command:

```yaml
version: 2.1

jobs:
  gh-release:
    docker:
      - image: cimg/node:16.14
    steps:
      - checkout
      - run:
        name: Create release from specified tag
        command: |
          GITHUB_TOKEN="$GITHUB_TOKEN" \
          TARGET_TAG="<<pipeline.parameters.release-tag>>" \
          REPO_OWNER="$CIRCLE_PROJECT_USERNAME" \
          REPO_NAME="$CIRCLE_PROJECT_REPONAME" \
          CONTINUE_ON_ERROR="false" \
          npx https://github.com/kristw/circleci-gh-conventional-release
workflows:
  version: 2
    jobs:
      - gh-release
```

### Github Actions

```yaml
name: New Release

on:
  push:
    tags:
      - "v*"

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v2
      - name: Setup Node
        uses: actions/setup-node@v1
        with:
          node-version: 14.x
      - name: Generate Release
        shell: bash
        run: |
          TARGET_TAG="${GITHUB_REF#refs/*/}" \
          REPO_OWNER="${GITHUB_REPOSITORY%/*}" \
          REPO_NAME="${GITHUB_REPOSITORY#*/}" \
          CONTINUE_ON_ERROR="false" \
          GITHUB_TOKEN="${{ secrets.GITHUB_TOKEN }}" \
          npx https://github.com/kristw/circleci-gh-conventional-release
```

#### Github Actions with template

```yaml
name: New Release

on:
  push:
    tags:
      - "v*"

jobs:
  stage:
    uses: kristw/gh-conventional-release/.github/workflows/create-release-template.yml@master
    name: "Release"
    secrets:
      gh_token: ${{ secrets.GITHUB_TOKEN }}
```

## Development

In order to publish to production you should generate a new tag.

The convenient and proper way to do it is to run the following command:

```sh
npm run release
```
