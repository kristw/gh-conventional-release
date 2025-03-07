const { GitHubService } = require('./github')

describe('getPreviousTag', () => {
  it('returns previous tag', async () => {
    const listTags = jest.fn().mockResolvedValue({
      data: [
        { name: 'v1.2.3' },
        { name: 'v1.0.0' },
        { name: 'v0.5.2' },
        { name: 'v0.5.3' }
      ]
    })
    const gh = new GitHubService({ repos: { listTags } }, 'foo', 'bar')

    const res = await gh.getPreviousTag('v1.0.0')

    expect(res).toEqual('v0.5.3')
    expect(listTags).toHaveBeenCalledWith({
      owner: 'foo',
      repo: 'bar'
    })
  })

  it('returns previous alpha tag', async () => {
    const listTags = jest.fn().mockResolvedValue({
      data: [
        { name: 'v1.2.3' },
        { name: 'v1.0.0' },
        { name: 'v0.5.2' },
        { name: 'v0.5.3' },
        { name: 'v0.0.1a200' },
        { name: 'v0.0.1a20' }
      ]
    })
    const gh = new GitHubService({ repos: { listTags } }, 'foo', 'bar')

    const res = await gh.getPreviousTag('v0.0.1a200')

    expect(res).toEqual('v0.0.1a20')
    expect(listTags).toHaveBeenCalledWith({
      owner: 'foo',
      repo: 'bar'
    })
  })

  it('returns previous alpha tag for first real version', async () => {
    const listTags = jest.fn().mockResolvedValue({
      data: [
        { name: 'v1.2.3' },
        { name: 'v1.0.0' },
        { name: 'v0.5.2' },
        { name: 'v0.5.3' },
        { name: 'v0.0.1a200' },
        { name: 'v0.0.1a20' }
      ]
    })
    const gh = new GitHubService({ repos: { listTags } }, 'foo', 'bar')

    const res = await gh.getPreviousTag('v0.5.2')

    expect(res).toEqual('v0.0.1a200')
    expect(listTags).toHaveBeenCalledWith({
      owner: 'foo',
      repo: 'bar'
    })
  })

  it('should returns previous tag when invalid tag is provided', async () => {
    const listTags = jest.fn().mockResolvedValue({
      data: [
        { name: 'v0.5.0' },
        { name: 'v.0.5.1' },
        { name: 'v.0.5.2' },
        { name: 'v.0.5.3' }
      ]
    })
    const gh = new GitHubService({ repos: { listTags } }, 'foo', 'bar')

    const res = await gh.getPreviousTag('v1.0.0')

    expect(res).toEqual('v0.5.0')
    expect(listTags).toHaveBeenCalledWith({
      owner: 'foo',
      repo: 'bar'
    })
  })

  it('should returns undefined when only invalid tag is provided', async () => {
    const listTags = jest.fn().mockResolvedValue({
      data: [
        { name: 'v.0.5.0' },
        { name: 'v.0.5.1' },
        { name: 'v.0.5.2' },
        { name: 'v.0.5.3' }
      ]
    })
    const gh = new GitHubService({ repos: { listTags } }, 'foo', 'bar')

    const res = await gh.getPreviousTag('v1.0.0')

    expect(res).toEqual(undefined)
    expect(listTags).toHaveBeenCalledWith({
      owner: 'foo',
      repo: 'bar'
    })
  })

  it('returns undefined when there aren\'t any tags', async () => {
    const listTags = jest.fn().mockResolvedValue({
      data: []
    })
    const gh = new GitHubService({ repos: { listTags } }, 'foo', 'bar')

    const res = await gh.getPreviousTag('v1.0.0')

    expect(res).toEqual(undefined)
  })
})

describe('compareCommits', () => {
  it('return list of commits between two tags', async () => {
    const compareCommits = jest.fn().mockResolvedValue({
      data: { commits: ['ALL', 'THE', 'COMMITS'] }
    })
    const gh = new GitHubService({ repos: { compareCommits } }, 'foo', 'bar')

    const res = await gh.compareCommits('v0.5.3', 'v1.0.0')

    expect(res).toEqual(['ALL', 'THE', 'COMMITS'])
    expect(compareCommits).toHaveBeenCalledWith({
      base: 'v0.5.3',
      head: 'v1.0.0',
      owner: 'foo',
      repo: 'bar'
    })
  })

  it('returns commits up to the tag when there is no base', async () => {
    const listCommits = jest.fn().mockResolvedValue({
      data: ['ALL', 'THE', 'COMMITS']
    })

    const gh = new GitHubService({ repos: { listCommits } }, 'foo', 'bar')

    const res = await gh.compareCommits(undefined, 'v1.0.0')

    expect(res).toEqual(['ALL', 'THE', 'COMMITS'])
    expect(listCommits).toHaveBeenCalledWith({
      sha: 'v1.0.0',
      per_page: 100,
      owner: 'foo',
      repo: 'bar'
    })
  })
})

describe('createRelease', () => {
  it('creates a new release', async () => {
    const createRelease = jest.fn().mockResolvedValue({ data: 'THE RELEASE' })
    const gh = new GitHubService({ repos: { createRelease } }, 'foo', 'bar')

    const res = await gh.createRelease('v1.2.3', 'RELEASE BODY')

    expect(res).toEqual('THE RELEASE')
    expect(createRelease).toHaveBeenCalledWith({
      tag_name: 'v1.2.3',
      name: 'v1.2.3',
      body: 'RELEASE BODY',
      owner: 'foo',
      repo: 'bar'
    })
  })
})
