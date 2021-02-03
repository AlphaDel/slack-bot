import { Octokit } from '@octokit/rest'

interface GithubPullRequest {
  owner: string,
  repo: string,
  head: string,
  base: string,
  title: string,
}

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
  timeZone: 'Asia/Bangkok',
  log: {
    debug: () => {},
    info: () => {},
    warn: console.warn,
    error: console.error
  },
})

const CreatePullRequest = async (data: GithubPullRequest) => {
  const { owner, repo, base, head, title } = data
  try {
    const result = await octokit.pulls.create({
      owner,
      repo,
      head,
      base,
      title,
    })
    return result
  } catch (error) {
    throw error
  }
}

export {
    CreatePullRequest
}