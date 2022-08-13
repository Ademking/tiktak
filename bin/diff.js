import prompts from 'prompts'
import { abortPrompt, runCmd } from './utils.js'

const diff = async () => {
  const selectDiff = await prompts({
    type: 'text',
    name: 'value',
    message: 'Enter the path or the file you want to diff',
    initial: '.',
    onState: abortPrompt
  })

  const diffCmd = `git diff ${selectDiff.value}`
  runCmd(diffCmd)
}

export { diff }
