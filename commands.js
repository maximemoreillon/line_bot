const utils = require('./utils')
const axios = require('axios')

const secrets = require('./secrets');

axios.defaults.headers.common['Authorization'] = `Bearer ${secrets.jwt}`

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

      axios.get(secrets.finances_api_url, {params: {account: secrets.finances_account_name}})
      .then(response => {
        utils.send_response(reply_token,`Current balance is JPY ${response.data}`);
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

      axios.get(secrets.weight_api_url)
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

      axios.get(secrets.current_consumption_api_url)
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

      axios.get(secrets.solar_api_url)
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

      axios.get(secrets.room_api_url)
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
