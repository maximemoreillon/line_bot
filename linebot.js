const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const cors = require('cors')
const dotenv = require('dotenv');

const auth = require('@moreillon/express_identification_middleware')

const commands = require('./commands')
const utils = require('./utils')

const line_user_id  = process.env.LINE_USER_ID

dotenv.config()

// Port config
var port = 80
if(process.env.APP_PORT) port=process.env.APP_PORT

const auth_options = { url: `${process.env.AUTHENTICATION_API_URL}/whoami` }

const app = express()
app.use(bodyParser.json())
app.use(cors())


app.get('/', (req, res) => {
  res.send("Line bot v1.0.2")
})

app.post('/webhook', (req, res) => {
  // Webhook used by LINE

  // Return a response to acknowledge receipt of the event
  res.sendStatus(200);

  let message = req.body.events[0].message.text;
  let reply_token = req.body.events[0].replyToken;

  let found_command = commands.find(command => {
    return command.message.toLowerCase() === message.toLowerCase()
  })

  if(found_command) {
    if(!found_command.private || req.body.events[0].source.userId === line_user_id) {
      found_command.command(reply_token)
    }
    else {
      utils.send_response(reply_token,"Permission denied for command " + message);
    }
  }
  else {
    utils.send_response(reply_token,"Command not found: " + message);
  }

});

app.post('/notify', auth(auth_options), (req, res) => {

  const {message} = req.body

  if(!message) return res.status(400).send('message not present in body')

  res.send('OK');
  utils.send_message_to_me(message)

})

app.listen(port, () => {
  console.log(`Line bot listening on port ${port}!`)
})
