const request = require('request');
const config = require('./config');

exports.send_message_to_me = function(message_text){
  request.post('https://api.line.me/v2/bot/message/push', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + config.channel_access_token,
    },
    json: {
      to: config.my_user_id,
      messages: [
        {type: 'text', text: message_text},
      ]
    }
  }, (error, res, body) => {
    if (error) {
      console.error(error)
      return
    }
  });
}


exports.send_response = function(reply_token, response_text){
  // create response
  request.post('https://api.line.me/v2/bot/message/reply', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + config.channel_access_token,
    },
    json: {
      replyToken: reply_token,
      messages: [
        {type: 'text', text: response_text},
      ]
    }
  }, (error, res, body) => {
    if (error) {
      console.error(error)
      return
    }
  });
}
