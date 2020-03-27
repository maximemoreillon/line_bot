const utils = require('./utils')
const axios = require('axios')
const jwt = require('jsonwebtoken')

const secrets = require('./secrets');

jwt.sign({ username: secrets.jwt_username }, secrets.jwt_secret, (err, token) => {
  if(err) return console.log('Error generating token')
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
})

module.exports = [
  {
    message: "hello",
    private: false,
    command: (reply_token) => {
      utils.send_response(reply_token,"Hello to you too!");
    }
  },

  {
    message: "balance",
    private: true,
    command: (reply_token) => {

      axios.post(secrets.finances_api_url, {account: secrets.finances_account_name})
      .then(response => {
        utils.send_response(reply_token,"Current balance is " + response.data + "円");
      })
      .catch(error => {
        utils.send_response(reply_token, `Error connecting to ${secrets.finances_api_url} : ${error}`)
      })

    }
  },

  {
    message: "weight",
    private: true,
    command: (reply_token) => {

      axios.post(secrets.weight_api_url, {})
      .then(response => {
        utils.send_response(reply_token,"Current weight: " + response.data.weight+ " kg");
      })
      .catch(error => {
        utils.send_response(reply_token, `Error connecting to ${secrets.weight_api_url} : ${error}`);
      })

    }
  },

  {
    message: "current",
    private: true,
    command: (reply_token) => {

      axios.get(secrets.current_consumption_api_url, {})
      .then(response => {
        utils.send_response(reply_token,`Apartment current consumption: ${response.data.total}A`);
      })
      .catch(error => {
        utils.send_response(reply_token, `Error connecting to ${secrets.current_consumption_api_url} : ${error}`);
      })

    }
  },

  {
    message: "solar",
    private: true,
    command: (reply_token) => {

      axios.get(secrets.solar_api_url, {})
      .then(response => {
        utils.send_response(reply_token,`Current battery voltage: ${response.data.voltage}V`);
      })
      .catch(error => {
        utils.send_response(reply_token, `Error connecting to ${secrets.solar_api_url} : ${error}`);
      })

    }
  },
  {
    message: "room",
    private: true,
    command: (reply_token) => {

      axios.get(secrets.room_api_url, {})
      .then(response => {
        utils.send_response(reply_token,`Current room: ${response.data}`);
      })
      .catch(error => {
        utils.send_response(reply_token, `Error connecting to ${secrets.room_api_url} : ${error}`);
      })

    }
  },

  {
    message: "commands",
    private: false,
    command: (reply_token) => {
      let command_list = []
      module.exports.forEach( command => {
        command_list.push(command.message)
      })
      let response = 'Command list: \n'
      response += command_list.join('\n')
      utils.send_response(reply_token,response);

    }
  },

]
