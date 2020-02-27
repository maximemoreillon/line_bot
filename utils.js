const axios = require('axios')
const config = require('./config');

exports.send_message_to_me = function(message_text){

  let url = 'https://api.line.me/v2/bot/message/push'

  let data = {
    to: config.my_user_id,
    messages: [
      {type: 'text', text: message_text},
    ]
  }

  let options = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + config.channel_access_token,
    }
  }

  axios.post(url,data,options)
  .then( () => console.log("Message sent successfuly"))
  .catch(error => console.log(error))
}


exports.send_response = function(reply_token, response_text){
  // create response

  let url = 'https://api.line.me/v2/bot/message/reply';
  let data = {
    replyToken: reply_token,
    messages: [
      {type: 'text', text: response_text},
    ]
  };
  let options = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + config.channel_access_token,
    },
  }

  axios.post(url, data, options)
  .then(() => console.log("Response sent successfuly"))
  .catch(error => console.log(error))
}
