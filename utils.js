const axios = require('axios')
const dotenv = require('dotenv');

dotenv.config()

const line_user_id  = process.env.LINE_USER_ID


const request_options = {
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.LINE_CHANNEL_ACCESS_TOKEN}`,
  }
}

exports.send_message_to_me = (message_text) => {

  const url = 'https://api.line.me/v2/bot/message/push'

  const data = {
    to: line_user_id,
    messages: [
      {type: 'text', text: message_text},
    ]
  }


  axios.post(url,data,request_options)
  .then( () => console.log("Message sent successfuly"))
  .catch(error => console.log(error))
}


exports.send_response = (reply_token, response_text) => {
  // create response

  const url = 'https://api.line.me/v2/bot/message/reply';
  const data = {
    replyToken: reply_token,
    messages: [
      {type: 'text', text: response_text},
    ]
  };

  axios.post(url, data, request_options)
  .then(() => console.log("Response sent successfuly"))
  .catch(error => console.log(error))
}
