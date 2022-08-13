import prompts from 'prompts'
import { abortPrompt, runCmd } from './utils.js'

const pushGit = async () => {
  const pathSpecResp = await prompts({
    type: 'text',
    name: 'value',
    message: 'Enter new or changed files to commit',
    initial: '.',
    onState: abortPrompt
  })

  const commitTypeResp = await prompts({
    type: 'autocomplete',
    name: 'value',
    message: 'Commit Type',
    choices: [
      { title: 'No Type', value: 'empty', description: 'No Type' }, // I need to use "empty" for no type, prompts uses the title as value if no value is provided
      { title: '✨ feat', value: ':sparkles: feat:', description: 'A new feature' },
      { title: '🐛 fix', value: ':bug: fix:', description: 'A bug fix' },
      { title: '📝 docs', value: ':memo: docs:', description: 'Documentation only changes' },
      { title: '💄 style', value: ':lipstick: style:', description: 'Changes that do not affect the meaning of the code (white-space, formatting, etc)' },
      { title: '♻️ refactor', value: ':recycle: refactor:', description: 'A code change that neither fixes a bug nor adds a feature' },
      { title: '⚡️ perf', value: ':zap: perf:', description: 'A code change that improves performance' },
      { title: '🧪 test', value: ':test_tube: test:', description: 'Adding missing tests or correcting existing tests' },
      { title: '🏗️ build', value: ':building_construction: build:', description: 'Changes that affect the build system or external dependencies' },
      { title: '🔧 chore', value: ':wrench: chore:', description: "Other changes that don't modify src or test files" },
      { title: '⏪️ revert', value: ':rewind: revert:', description: 'Reverts a previous commit' },
      { title: '🚧 WIP', value: ':construction: WIP:', description: 'Work in progress' }
    ],
    onState: abortPrompt
  })

  const commitMsgResp = await prompts({
    type: 'text',
    name: 'value',
    message: 'Commit Message',
    validate: value => (value.length > 0 ? true : 'Please enter a commit message'),
    onState: abortPrompt
  })

  const pushResp = await prompts({
    type: 'text',
    name: 'value',
    message: 'Push to which branch?',
    initial: 'main',
    onState: abortPrompt
  })

  const gitAddCmd = `git add ${pathSpecResp.value}`
  const commitCmd = `git commit -m "${(commitTypeResp.value === 'empty' ? '' : commitTypeResp.value + ' ') + commitMsgResp.value}"`
  const pushCmd = `git push origin ${pushResp.value}`

  runCmd(`${gitAddCmd} && ${commitCmd} && ${pushCmd}`)
}

export default pushGit
