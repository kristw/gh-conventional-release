const semver = require('semver')
const { isMinervaVersion, MinervaVersion } = require('./MinervaVersion')

const semanticVersionRegex = /^v([0-9]|[1-9][0-9]*)\.([0-9]|[1-9][0-9]*)\.([0-9]|[1-9][0-9]*)(?:-([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?(?:\+[0-9A-Za-z-]+)?$/

function isSemanticVersion (version) {
  return semanticVersionRegex.test(version)
}

class GitHubService {
  /**
   * @param {import('@octokit/rest').Octokit} gh
   * @param {string} repoOwner
   * @param {string} repoName
   */
  constructor (gh, repoOwner, repoName) {
    this.gh = gh
    this.repo = { owner: repoOwner, repo: repoName }
  }

  /**
   * @param {string} targetTag
   * @returns {Promise<string>}
   */
  async getPreviousTag (targetTag) {
    const tagResponse = await this.gh.repos.listTags(this.repo)
    const allTags = tagResponse.data.map(tag => tag.name)

    const tagList = semver.sort(allTags.filter(tag => isSemanticVersion(tag)))
      .reverse()
      .concat(allTags
      .filter(tag => isMinervaVersion(tag))
      .map(tag => new MinervaVersion(tag))
      .sort((a, b) => a.compareTo(b))
      .map(x => x.fullVersion)
      .reverse());

    const index = tagList.findIndex(tag => tag === targetTag)
    if(index < tagList.length - 1) return tagList[index + 1]

    return undefined
  }

  /**
   * @param {string} base
   * @param {string} head
   */
  async compareCommits (base, head) {
    if (!base) {
      const res = await this.gh.repos.listCommits({
        sha: head,
        per_page: 100,
        ...this.repo
      })

      return res.data
    }

    const res = await this.gh.repos.compareCommits({
      base,
      head,
      ...this.repo
    })

    return res.data.commits
  }

  /**
   * @param {string} tag
   * @param {string} body
   */
  async createRelease (tag, body) {
    const res = await this.gh.repos.createRelease({
      tag_name: tag,
      name: tag,
      body: body,
      ...this.repo
    })

    return res.data
  }
}

module.exports.GitHubService = GitHubService
