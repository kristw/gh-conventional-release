const requiredConfig = [
  'gitHubToken',
  'targetTag',
  'repoOwner',
  'repoName'
];

const ENV_VAR_NAMES = ["GITHUB_URL", "GITHUB_TOKEN", "TARGET_TAG", "REPO_OWNER", "REPO_NAME", "CONTINUE_ON_ERROR"];

function readConfig () {
  const config = {
    gitHubUrl: process.env.GITHUB_URL,
    gitHubToken: process.env.GITHUB_TOKEN,
    targetTag: process.env.TARGET_TAG,
    repoOwner: process.env.REPO_OWNER,
    repoName: process.env.REPO_NAME,
    continueOnError: process.env.CONTINUE_ON_ERROR === 'true'
  };

  const missingConfig = requiredConfig.filter(key => !config[key]);
  if (missingConfig.length > 0) {
    throw new Error(`Missing configuration: ${missingConfig.join(', ')}`);
  }

  return config;
}

module.exports.readConfig = readConfig;
module.exports.ENV_VAR_NAMES = ENV_VAR_NAMES;
