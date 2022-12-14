import prompts from 'prompts'
import { abortPrompt, runCmd, currentBranch } from './utils.js'

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
      { title: 'No Emoji', value: 'empty', description: 'No Emoji' }, // I need to use "empty" for no type, prompts uses the title as value if no value is provided
      { title: 'โจ feat', value: ':sparkles: feat:', description: 'A new feature' },
      { title: '๐ fix', value: ':bug: fix:', description: 'A bug fix' },
      { title: '๐ docs', value: ':memo: docs:', description: 'Documentation only changes' },
      { title: '๐ style', value: ':lipstick: style:', description: 'Changes that do not affect the meaning of the code (white-space, formatting, etc)' },
      { title: 'โป๏ธ refactor', value: ':recycle: refactor:', description: 'A code change that neither fixes a bug nor adds a feature' },
      { title: 'โก๏ธ perf', value: ':zap: perf:', description: 'A code change that improves performance' },
      { title: '๐งช test', value: ':test_tube: test:', description: 'Adding missing tests or correcting existing tests' },
      { title: '๐๏ธ build', value: ':building_construction: build:', description: 'Changes that affect the build system or external dependencies' },
      { title: '๐ง chore', value: ':wrench: chore:', description: "Other changes that don't modify src or test files" },
      { title: 'โช๏ธ revert', value: ':rewind: revert:', description: 'Reverts a previous commit' },
      { title: '๐ง WIP', value: ':construction: WIP:', description: 'Work in progress' }
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
    initial: await currentBranch(),
    onState: abortPrompt
  })

  const gitAddCmd = `git add ${pathSpecResp.value}`
  const commitCmd = `git commit -m "${(commitTypeResp.value === 'empty' ? '' : commitTypeResp.value + ' ') + commitMsgResp.value}"`
  const pushCmd = `git push origin ${pushResp.value}`

  runCmd(`${gitAddCmd} && ${commitCmd} && ${pushCmd}`)
}

export default pushGit
