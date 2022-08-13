#!/usr/bin/env node
import prompts from 'prompts'
import isGit from 'is-git-repository'
import newGitRepo from './new.js'
import { checkgitInstalled, abortPrompt, runCmd, currentBranch, getLastCommitDate, getListBranches, fuzzySearcher } from './utils.js'
import pushGit from './push.js'
import { diff } from './diff.js'
import { log } from './log.js'
import { branch } from './branch.js'
import { checkout } from './checkout.js'
import { formatDistance } from 'date-fns'
import chalk from 'chalk'
import updateNotifier from 'update-notifier'
import packageJson from '../package.json' assert { type: 'json' }

;(async () => {
  checkgitInstalled()

  updateNotifier({pkg: packageJson}).notify();

  try {
    const currentBranchName = await currentBranch()
    const lastCommitDate = await getLastCommitDate(currentBranchName)
    const dateDistance = formatDistance(new Date(lastCommitDate), new Date(), { addSuffix: true })
    console.log(`✨ Current branch: ${chalk.green.bold(currentBranchName)}\n📅 Last commit: ${new Date(lastCommitDate).toLocaleString()} (${chalk.italic(dateDistance)})\n`)
  } catch (e) {}

  const mainChoices = [
    { title: 'Create a new repository', description: '', value: 'new', disabled: isGit() }, // disabled if this is a git repository already
    { title: 'Add, Commit and Push', description: '', value: 'push', disabled: !isGit() },
    { title: 'Pull latest changes', description: '', value: 'fetchmerge', disabled: !isGit() },
    { title: 'List all branches', description: '', value: 'listbranches', disabled: !isGit() },
    { title: 'Create a new branch', description: '', value: 'newbranch', disabled: !isGit() },
    { title: 'Checkout a branch', description: '', value: 'checkout', disabled: !isGit() },
    { title: 'Show log', description: '', value: 'log', disabled: !isGit() },
    { title: 'Show the differences', description: '', value: 'diff', disabled: !isGit() },
    { title: 'Exit', description: '', value: 'exit', disabled: false }
  ].filter(c => c.disabled === false)

  const mainSelection = await prompts({
    type: 'autocomplete',
    name: 'value',
    message: 'What would you like to do?',
    choices: mainChoices,
    suggest: async (input, choices) => {
      let x = await fuzzySearcher(choices, input)
      return x
    },
    onState: abortPrompt
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
    case 'fetchmerge':
      runCmd('git pull')
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
      break
    case 'exit':
      process.exit(0)
      break
    default:
      break
  }
})()
