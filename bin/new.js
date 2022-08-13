import prompts from 'prompts'
import url from 'url'
import { abortPrompt, runCmd } from './utils.js'

const newGitRepo = async () => {
  // add all files to the repository
  const pathSpecResp = await prompts({
    type: 'text',
    name: 'value',
    message: 'Enter specific directory or file to add to the repository',
    initial: '.',
    onState: abortPrompt
  })

  const commitMsgResp = await prompts({
    type: 'text',
    name: 'value',
    message: 'Commit Message',
    initial: 'Initial commit',
    validate: value => (value.length > 0 ? true : 'Please enter a commit message'),
    onState: abortPrompt
  })

  const commitTypeResp = await prompts({
    type: 'autocomplete',
    name: 'value',
    message: 'Commit Type',
    choices: [
      { title: 'No Type', value: '', description: 'No Type' },
      { title: '🎉 Init', value: ':tada:', description: 'Initial commit' }
    ],
    onState: abortPrompt
  })

  const remoteAddResp = await prompts({
    type: 'text',
    name: 'value',
    message: 'Remote URL',
    validate: value => {
      const parsed = url.parse(value)
      return parsed.protocol && parsed.host ? true : 'Please enter a valid URL'
    },
    onState: abortPrompt
  })

  const defaultBranchResp = await prompts({
    type: 'text',
    name: 'value',
    message: 'Default branch name',
    initial: 'main',
    onState: abortPrompt
  })

  const gitInitCmd = `git init`
  const gitAddCmd = `git add ${pathSpecResp.value}`
  const gitCommitCmd = `git commit -m "${commitTypeResp.value} ${commitMsgResp.value}"`
  const gitDefaultBranchCmd = `git branch -m ${defaultBranchResp.value}` // rename the default branch to 'main'
  const gitRemoteAddCmd = `git remote add origin ${remoteAddResp.value}`
  const gitPushCmd = `git push -u origin ${defaultBranchResp.value}`

  runCmd(`${gitInitCmd} && ${gitAddCmd} && ${gitCommitCmd} && ${gitDefaultBranchCmd} && ${gitRemoteAddCmd} && ${gitPushCmd}`)
}

export default newGitRepo
