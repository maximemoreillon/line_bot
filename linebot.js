const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const cors = require('cors')

const authorization_middleware = require('@moreillon/authorization_middleware')

const secrets = require('./secrets')
const commands = require('./commands')
const utils = require('./utils')


const port = 8087;

authorization_middleware.authentication_api_url = secrets.authentication_api_url


const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'dist')))


app.get('/', (req, res) => {
  res.send("Line bot")
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
    if(!found_command.private || req.body.events[0].source.userId === secrets.user_id) {
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

app.post('/notify', authorization_middleware.middleware, (req, res) => {

  if('message' in req.body) {
    res.send('OK');
    utils.send_message_to_me(req.body.message);
  }
  else {
    res.status(400)
  }
})

app.listen(port, () => {
  console.log(`Line bot listening on port ${port}!`)
})
