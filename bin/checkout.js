import prompts from 'prompts'
import { abortPrompt, getListBranches, runCmd } from './utils.js'

const parseBranches = str => {
  if (!str) return []
  let lines = str.trim().split('\n')
  let res = []
  lines.forEach(line => {
    let branch = line.trim().replace(/^\*\s*/, '')
    res.push(branch.split('/').pop())
  })
  res = [...new Set(res)]
  return res
}

// get list of branches
const listBranches = async () => {
  let branches = await getListBranches()
  if (branches.length > 0) {
    const selectBranch = await prompts({
      type: 'select',
      name: 'value',
      message: 'Select a branch to checkout',
      choices: branches.map(b => ({ title: b, value: b })),
      onState: abortPrompt
    })

    const checkoutCmd = `git checkout ${selectBranch.value}`
    runCmd(checkoutCmd)
  } else {
    console.log('No branches found')
  }
}

const checkout = () => {
  listBranches()
}

export { checkout }
