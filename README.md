# gh-conventional-release

Create releases on GitHub based on tags

## Usage

Environment variables used for default parameters:

- `GITHUB_TOKEN`
- `CIRCLE_TAG` (set by default in CircleCI when build is triggered by a tag push)
- `CIRCLE_PROJECT_USERNAME` (set by default in CircleCI)
- `CIRCLE_PROJECT_REPONAME` (set by default in CircleCI)

### Plain Node.js

```sh
GITHUB_TOKEN="$GITHUB_TOKEN" \
TARGET_TAG="$CIRCLE_TAG" \
REPO_OWNER="$CIRCLE_PROJECT_USERNAME" \
REPO_NAME="$CIRCLE_PROJECT_REPONAME" \
CONTINUE_ON_ERROR="false" \
npx https://github.com/kristw/circleci-gh-conventional-release
```

### CircleCI

Assuming an environment with all the required variables, usage consists of simply calling the `create-release` job or command:

```yaml
version: 2.1

orbs:
  gh-release: escaletech/gh-conventional-release@0.1.0

workflows:
  version: 2
  release:
    jobs:
      # ... more jobs
      - gh-release/create-release:
          context: context-with-github-token-env-var
```

But you can always specify parameters individually:

```yaml
version: 2.1

orbs:
  gh-release: escaletech/gh-conventional-release@0.1.0

workflows:
  version: 2
  release:
    jobs:
      # ... more jobs
      - gh-release/create-release:
          github-token: ABCXYZ457 # default is $GITHUB_TOKEN
          target-tag: v0.1.2 # default is $CIRCLE_TAG
          repo-owner: your-username # default is $CIRCLE_PROJECT_USERNAME
          repo-name: your-repo-name # default is $CIRCLE_PROJECT_REPONAME
```

This will result in a GitHub release like the following:

![sample](docs/sample-release.png)

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
          node-version: 12.x
      - name: Install GH Conventional Release
        run: sudo npm install -g @kristw/gh-conventional-release
      - name: Generate Release
        shell: bash
        run: |
          TARGET_TAG="${GITHUB_REF#refs/*/}" \
          REPO_OWNER="${GITHUB_REPOSITORY%/*}" \
          REPO_NAME="${GITHUB_REPOSITORY#*/}" \
          CONTINUE_ON_ERROR="false" \
          GITHUB_TOKEN="${{ secrets.GITHUB_TOKEN }}" \
          circleci-gh-conventional-release
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
