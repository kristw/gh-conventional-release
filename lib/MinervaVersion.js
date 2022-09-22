const semver = require('semver')
const minervaAlphaVersionRegex = /^v?[0-9]+[.][0-9]+[.][0-9]+a[0-9]+$/

function isMinervaVersion(version) {
  return minervaAlphaVersionRegex.test(version)
}

class MinervaVersion {
  constructor(version) {
    const parts = version.split('a')
    this.version = parts[0]
    this.alpha = Number(parts[1])
    this.fullVersion = version
  }

  compareTo(another) {
    return semver.compare(this.version, another.version) || this.alpha - another.alpha;
  }
}

module.exports.isMinervaVersion = isMinervaVersion;
module.exports.MinervaVersion = MinervaVersion;
