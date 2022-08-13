import { execFile, exec } from 'child_process'
import spawn from 'await-spawn'
import Fuse from 'fuse.js'
import { readFile } from 'fs/promises'

const checkgitInstalled = () => {
  const child = execFile('git', ['--version'], (error, stdout, stderr) => {
    if (error) {
      console.log('Error: Git is not installed, please install it')
      process.exit(1)
    }
  })
}

const getPackageInfo = async () => {
  const pkg = await readFile(new URL('../package.json', import.meta.url))
  return JSON.parse(pkg)
}

const autoUpdate = async () => {
  const { name, version } = await getPackageInfo()
  const option = {
    pkg: {
      name,
      version
    },
    shouldNotifyInNpmScript: true,
    updateCheckInterval: 0
  }
  const notifier = updateNotifier(option)
  await notifier.notify()
}

const abortPrompt = state => {
  if (state.aborted) {
    process.nextTick(() => {
      process.exit(0)
    })
  }
}

const runCmd = async command => {
  try {
    const child = await spawn(command, [], {
      shell: true,
      stdio: 'inherit'
    })
  } catch (e) {}
}

const currentBranch = () =>
  new Promise((resolve, reject) => {
    return exec('git rev-parse --abbrev-ref HEAD', (err, stdout, stderr) => {
      if (err) reject(`getBranch Error: ${err}`)
      else if (typeof stdout === 'string') resolve(stdout.trim())
    })
  })

/**
 * Returns the date of the last commit of a specific branch
 * @param {string} branch
 * @returns {Promise<string>}
 */
const getLastCommitDate = branch =>
  new Promise((resolve, reject) => {
    return exec(`git log -1 --pretty=format:%cd ${branch}`, (err, stdout, stderr) => {
      if (err) reject(`getLastCommitDate Error: ${err}`)
      else if (typeof stdout === 'string') resolve(stdout.trim())
    })
  })

/**
 * Returns the list of branches
 * @returns {Promise<Array<string>>}
 */
const getListBranches = () =>
  new Promise((resolve, reject) => {
    return exec('git branch -a', (err, stdout, stderr) => {
      if (err) reject(`getListBranches Error: ${err}`)
      else if (typeof stdout === 'string') {
        const rawBranches = stdout.trim()
        if (!rawBranches) return []
        let lines = rawBranches.trim().split('\n')
        let res = []
        lines.forEach(line => {
          let branch = line.trim().replace(/^\*\s*/, '')
          res.push(branch.split('/').pop())
        })
        res = [...new Set(res)]
        resolve(res)
      }
    })
  })

const fuzzySearcher = async (choices, input) => {
  if (!input) return choices
  const options = {
    includeScore: true,
    keys: ['title']
  }
  const fuse = new Fuse(choices, options)
  const result = fuse.search(input).map(c => c.item)
  return result
}

export { checkgitInstalled, abortPrompt, runCmd, currentBranch, getLastCommitDate, getListBranches, fuzzySearcher, autoUpdate }
