import prompts from 'prompts'
import { abortPrompt, runCmd } from './utils.js'

const log = async () => {
  const selectType = await prompts({
    type: 'select',
    name: 'value',
    message: 'What would you like to do?',
    choices: [
      { title: 'Show Log (Short)', value: 'shortLog' },
      { title: 'Show Log (Full)', value: 'fullLog' },
      { title: 'Show Graph', value: 'graph' },
    ],
    onState: abortPrompt
  })

  switch (selectType.value) {
    case 'shortLog':
      runCmd('git log --oneline')
      break
    case 'fullLog':
      runCmd('git log')
      break
    case 'graph':
      runCmd('git log --all --decorate --oneline --graph')
      break
    default:
      break
  }
}

export { log }
