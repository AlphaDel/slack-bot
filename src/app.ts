import { App } from '@slack/bolt'
import requestAPI from './services'
import config from './config'

const app = new App({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  token: process.env.SLACK_BOT_TOKEN,
  endpoints: {
    events: '/slack/events',
    commands: '/slack/commands',
  },
})

const enterReplies = ['Hi', 'Target Acquired', 'Firing', 'Hello friend.', 'Gotcha', 'I see you']
const leaveReplies = ['Are you still there?', 'Target lost', 'Searching']
const randomEnterReply = () => enterReplies[Math.floor(Math.random() * enterReplies.length)]
const randomLeaveReply = () => leaveReplies[Math.floor(Math.random() * leaveReplies.length)]

app.event('member_joined_channel', async ({ say }) => {
  await say(randomEnterReply())
})
app.event('member_left_channel', async ({ say }) => {
  await say(randomLeaveReply())
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
    const token = await requestAPI({ url: config.REQUEST_TOKEN_URL, data: payload })
    const tokenPretty = JSON.stringify(token, null, 4).trim()
    say(`\`\`\`${tokenPretty}\`\`\`\n*Please do not forget to update <${config.TOKEN_PIN_URL_SLACK}|the token post>* :wowwow:<@${command.user_id}>:wowwow:`)
  } catch (error) {
    console.log('error: ', error)
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
    const token = await requestAPI({ url: config.REQUEST_TOKEN_URL, data: payload })
    const tokenPretty = JSON.stringify(token, null, 4).trim()
    say(`\`\`\`${tokenPretty}\`\`\`\n*Please do not forget to update <${config.TOKEN_PIN_URL_SLACK}|the token post>* :wowwow:<@${command.user_id}>:wowwow:`)
  } catch (error) {
    console.log('error: ', error)
  }
})

app.command('/delete-sign-azd', async ({ command, ack, respond, say }) => {
  await ack()
  if (command.text === undefined || command.text === '' || command.text === null) {
    return respond({
      response_type: 'ephemeral',
      text: `Please specify your file ID to delete.`,
    })
  } 
  try {
    const payload = {
      fieldId: command.text,
    }
    const { isDelete } = await requestAPI({ url: `${config.BACKEND_APPMAN_URL}${config.DELETE_SIGN_AZD_URL}`, data: payload})
    if (isDelete) {
      say(`<@${command.user_id}> File: \`${payload.fieldId}\` was deleted.`)
    }
  } catch (error) {
    console.log(error)
    respond({
      response_type: 'ephemeral',
      text: `Error: ${error}`,
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
