const express = require('express');
const request = require('request');
const bodyParser = require('body-parser');


const commands = require('./commands').commands;
const config = require('./config');
const utils = require('./utils');

const port = 8087;

const app = express();
app.use(bodyParser.json());


app.get('/', (req, res) => {
  res.send("Line bot")
})

app.post('/webhook', (req, res) => {

  const eventJson = req.body;
  var message = eventJson.events[0].message.text;
  var reply_token = eventJson.events[0].replyToken;
  console.log(message)

  var command_found = false;

  // Todo: Find better way to find command
  for(var command_index=0; command_index<commands.length; command_index++){
    if(commands[command_index].message.toLowerCase() === message.toLowerCase()){
      command_found = true;
      if(!commands[command_index].private || eventJson.events[0].source.userId === config.my_user_id){
        commands[command_index].command(reply_token);
      }
      else {
        utils.send_response(reply_token,"You do not have permission to run this command: " + message);
      }

      break;
    }
  }
  if(!command_found){
    utils.send_response(reply_token,"Command not found: " + message);
  }

  // Return a response to acknowledge receipt of the event
  res.sendStatus(200);
});

app.listen(port, () => {
  console.log(`Line bot API listening on port ${port}!`)
})


// Push a message on startup
utils.send_message_to_me("Line bot started");
