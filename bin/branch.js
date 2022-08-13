import prompts from 'prompts'
import { abortPrompt, runCmd } from './utils.js'

const branch = async () => {
  const selectBranch = await prompts({
    type: 'text',
    name: 'value',
    message: 'Enter the name of the branch you want to create',
    onState: abortPrompt
  })

    const branchCmd = `git checkout -b ${selectBranch.value}`
    const gitBranchCmd = `git branch`

    runCmd(`${branchCmd} && ${gitBranchCmd}`)
}

export { branch }
