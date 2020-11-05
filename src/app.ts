import { App } from '@slack/bolt'
import { BlockButtonAction } from '@slack/bolt/dist/types/actions' 
import {
  RequestAPI,
  GetJobIdWithName,
  ApproveJobWithId,
} from './services'
import config from './config'

const app = new App({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  token: process.env.SLACK_BOT_TOKEN,
  endpoints: {
    events: '/slack/events',
    commands: '/slack/commands',
    interactive: '/slack/interactive',
  },
})

app.message(':wave:', async ({ message, say }) => {
  await say(`Hello, <@${message.user}>`)
})

app.command('/generate-token-dfl', async ({ command, ack, say }) => {
  await ack()
  try {
    const payload = {
      code: 'appman',
      device_id: '1234567890',
      oauth_flag: 'Y',
      client_id: 'AZAYDFL2016UX',
      client_secret: 'c986c721fc563985b17f49676862d4d6fa88770a',
      version_no: '3.0.0',
    }
    const token = await RequestAPI({ url: config.REQUEST_TOKEN_URL, data: payload })
    const tokenPretty = JSON.stringify(token, null, 4).trim()
    say(`\`\`\`${tokenPretty}\`\`\`\n*Please do not forget to update <${config.TOKEN_PIN_URL_SLACK}|the token post>* :wowwow:<@${command.user_id}>:wowwow:`)
  } catch (error) {
    console.log( error)
  }
})

app.command('/generate-token-azd', async ({ command, ack, say }) => {
  await ack()
  try {
    const payload = {
      code: 'appman',
      device_id: '1234567890',
      oauth_flag: 'Y',
      client_id: 'AZAYAD2016UX',
      client_secret: '312e97a6efd76341a6950c352b1ed7f894ae6e09',
      version_no: '1.0.0',
    }
    const token = await RequestAPI({ url: config.REQUEST_TOKEN_URL, data: payload })
    const tokenPretty = JSON.stringify(token, null, 4).trim()
    say(`\`\`\`${tokenPretty}\`\`\`\n*Please do not forget to update <${config.TOKEN_PIN_URL_SLACK}|the token post>* :wowwow:<@${command.user_id}>:wowwow:`)
  } catch (error) {
    console.log(error)
  }
})

app.command('/delete-sign-azd', async ({ command, ack, respond, say }) => {
  await ack()
  if (command.text === undefined || command.text === '' || command.text === null) {
    return respond({
      text: `Please specify your file ID to delete.`,
      response_type: 'ephemeral',
      replace_original: false,
    })
  } 
  try {
    const payload = {
      fieldId: command.text,
    }
    const { isDelete } = await RequestAPI({ url: `${config.BACKEND_APPMAN_URL}/${config.DELETE_SIGN_AZD_URL}`, data: payload})
    if (isDelete) {
      say(`<@${command.user_id}> File: \`${payload.fieldId}\` was deleted.`)
    }
  } catch (error) {
    console.log(error)
    respond({
      text: error,
      response_type: 'ephemeral',
      replace_original: false,
    })
  }
})

app.action('button-visit-workflow-action', async ({ ack }) => {
  await ack()
})

const ApproveJob = async ({ workflowId, jobName }: { workflowId: string, jobName: string }) => {
  try {
    console.log('workflowId: ', workflowId, ' jobName: ', jobName)
    const jobId = await GetJobIdWithName({ url: `${config.CIRCLECI_API}/workflow/${workflowId}/job`, data: { jobName } })
    console.log('jobId: ', jobId)
    if (!jobId) {
      throw new Error(`Job not found (workflow ID: \`${workflowId}\`).`)
    }
    await ApproveJobWithId({ url: `${config.CIRCLECI_API}/workflow/${workflowId}/approve/${jobId}`})
  } catch (error) {
    throw new Error(error.message)
  }
}

app.action('action_circleci_approve_azd_release_UAT', async ({ ack, respond, body }) => {
  await ack()
  await respond({
    text: '🤖 Roger that!, executing your order...',
    response_type: 'ephemeral',
    replace_original: false,
  })
  try {
    const { value: workflowId }: { value: string } = (<BlockButtonAction>body).actions[0]
    await ApproveJob({ workflowId, jobName: 'approval' })
  } catch (error) {
    console.log(error.message)
    await respond({
      text: error.message,
      response_type: 'ephemeral',
      replace_original: false,
    })
  }
})

app.action('action_circleci_approve_azd_release_DEV', async ({ ack, respond, body }) => {
  await ack()
  await respond({
    text: '🤖 Roger that!, executing your order...',
    response_type: 'ephemeral',
    replace_original: false,
  })
  
  try {
    const { value: workflowId }: { value: string } = (<BlockButtonAction>body).actions[0]
    await ApproveJob({ workflowId, jobName: 'approval_dev' })
  } catch (error) {
    console.log(error.message)
    await respond({
      text: error.message,
      response_type: 'ephemeral',
      replace_original: false,
    })
  }
})

app.action('action_circleci_approve_azd_release_PA', async ({ ack, respond, body }) => {
  await ack()
  await respond({
    text: '🤖 Roger that!, executing your order...',
    response_type: 'ephemeral',
    replace_original: false,
  })
  try {
    const { value: workflowId }: { value: string } = (<BlockButtonAction>body).actions[0]
    await ApproveJob({ workflowId, jobName: 'approval_pa' })
  } catch (error) {
    console.log(error.message)
    await respond({
      text: error.message,
      response_type: 'ephemeral',
      replace_original: false,
    })
  }
})

app.error(async error => {
  const message = `DOES NOT COMPUTE: ${error.toString()}`
  console.error(message)
})

;(async () => {
  // Start the app
  await app.start(process.env.PORT || 3000)
  console.log(`⚡️ Bolt app is running! on port ${process.env.PORT || 3000}`)
})()
