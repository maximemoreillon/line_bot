const axios = require('axios')
const dotenv = require('dotenv');

dotenv.config()

const {
  LINE_USER_ID,
  LINE_CHANNEL_ACCESS_TOKEN,
} = process.env



const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${LINE_CHANNEL_ACCESS_TOKEN}`,
  }

exports.send_message_to_self = (message_text) => {

  const url = 'https://api.line.me/v2/bot/message/push'

  const data = {
    to: LINE_USER_ID,
    messages: [
      {type: 'text', text: message_text},
    ]
  }


  return axios.post(url, data, { headers })
}


exports.send_response = (replyToken, text) => {

  const url = 'https://api.line.me/v2/bot/message/reply'
  const data = {
    replyToken,
    messages: [
      { type: 'text', text },
    ]
  }

  return axios.post(url, data, { headers })
}
