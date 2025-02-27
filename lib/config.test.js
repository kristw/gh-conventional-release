const { readConfig, ENV_VAR_NAMES } = require('./config')

function backup_env() {
  const backup = {};
  ENV_VAR_NAMES.forEach(key => {
    const value = process.env[key];
    if (value !== undefined && value !== null) {
      backup[key] = value;
    }
  });
  return backup;
}

function restore_env(backup) {
  Object.keys(backup).forEach(key => { process.env[key] = backup[key] });
}

describe('readConfig', () => {
  it('crashes if no ENV variables is provided', async () => {
    expect(() => { readConfig() }).toThrow()
  });

  it('takes required env variables', async () => {
    const backup = backup_env();

    process.env.GITHUB_TOKEN = "my_token";
    process.env.TARGET_TAG = "my_tag";
    process.env.REPO_OWNER = "the_owner";
    process.env.REPO_NAME = "repooooo";
    const c = readConfig();
    expect(c.gitHubUrl).toBeUndefined();
    expect(c.gitHubToken).toEqual("my_token");
    expect(c.targetTag).toEqual("my_tag");
    expect(c.repoOwner).toEqual("the_owner");
    expect(c.repoName).toEqual("repooooo");
    expect(c.continueOnError).toEqual(false);

    restore_env(backup);
  });

  it('takes optional env variables', async () => {
    const backup = backup_env();

    process.env.GITHUB_URL = "my_url";
    process.env.GITHUB_TOKEN = "my_token";
    process.env.TARGET_TAG = "my_tag";
    process.env.REPO_OWNER = "the_owner";
    process.env.REPO_NAME = "repooooo";
    process.env.CONTINUE_ON_ERROR = "true";
    const c = readConfig();
    expect(c.gitHubUrl).toEqual("my_url");
    expect(c.gitHubToken).toEqual("my_token");
    expect(c.targetTag).toEqual("my_tag");
    expect(c.repoOwner).toEqual("the_owner");
    expect(c.repoName).toEqual("repooooo");
    expect(c.continueOnError).toEqual(true);

    restore_env(backup);
  });
});
