#!/usr/bin/env node
import prompts from 'prompts'
import isGit from 'is-git-repository'
import newGitRepo from './new.js'
import { checkgitInstalled, abortPrompt, runCmd, currentBranch, getLastCommitDate, getListBranches } from './utils.js'
import pushGit from './push.js'
import { diff } from './diff.js'
import { log } from './log.js'
import { branch } from './branch.js'
import { checkout } from './checkout.js'
;(async () => {
  checkgitInstalled()

  try {
    const currentBranchName = await currentBranch()
    const lastCommitDate = await getLastCommitDate(currentBranchName)
    console.log(`✨ Current branch: ${currentBranchName}\n📅 Last commit: ${new Date(lastCommitDate).toLocaleString()}\n`)
  } catch (e) {}

  const mainSelection = await prompts({
    type: 'select',
    name: 'value',
    message: 'What would you like to do?',
    choices: [
      { title: 'Create a new repository', value: 'new', disabled: isGit() }, // disabled if this is a git repository already
      { title: 'Add, Commit and Push', value: 'push', disabled: !isGit() },
      { title: 'List all branches', value: 'listbranches', disabled: !isGit() },
      { title: 'Create a new branch', value: 'newbranch', disabled: !isGit() },
      { title: 'Checkout a branch', value: 'checkout', disabled: !isGit() },
      { title: 'Show Log', value: 'log', disabled: !isGit() },
      { title: 'Show Diff', value: 'diff', disabled: !isGit() },
      { title: 'Exit', value: 'exit' }
    ],
    warn: 'This option is not available yet',
    onState: abortPrompt,
    initial: isGit() ? 1 : 0
  })
  switch (mainSelection.value) {
    case 'new':
      newGitRepo()
      break
    case 'push':
      pushGit()
      break
    case 'listbranches':
      runCmd('git branch -a')
      break
    case 'newbranch':
      branch()
      break
    case 'checkout':
      checkout()
      break
    case 'log':
      log()
      break
    case 'fullLog':
      runCmd('git log')
      break
    case 'diff':
      diff()
    default:
      break
  }
})()
